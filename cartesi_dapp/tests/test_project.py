import datetime
import logging
import pytest
import json

from cartesi.testclient import TestClient

from cartesi.abi import encode_model

from tribes.dapp import dapp, TRIBE_MINT_SIG, TRIBE_MINT_AFF_SIG
from tribes.models import (
    CreateProjectData,
    CreateProjectInput,
    PlaceBidInput,
    DepositEtherPayload,
    TribeMintPayload,
    TribeMintWithAffiliatePayload,
)

from tribes.config import settings

LOGGER = logging.getLogger(__name__)

CREATOR_ADDRESS = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199"
TRIBE_ADDRESS = "0x721be000f6054b5e0e57aaab791015b53f0a18f4"
SUPPORTER_ADDRESS = "0x50090000689e92897b819e039327479c0b123495"

BIDDER_1_ADDRESS = "0xb1d0010a694ddef7f4bdaac3f04ccacee4d5ffff"
BIDDER_2_ADDRESS = "0xb1d00203e1e5b2e37817fff15d735fe59c4cffff"

ENDUSER_1_ADDRESS = "0xeeee0100dc75e8ca8318735c70064caafb80eeee"
ENDUSER_2_ADDRESS = "0xeeee0200f442469372bc9af3954b7c96ef13eeee"

AFFILIATE_ADDRESS = "0xaff170abe7bdca5e9f8982a191c13a09d050aaaa"

ETH_unit = int(1e18)
USDC_unit = int(1e6)


@pytest.fixture
def project_creation_payload() -> str:
    """Generate a project creation payload"""

    project = CreateProjectData(
        name="Test Project",
        description="This is the **best** project ever!!",

        creator_rate_pct=10,
        affiliate_rate_pct=5,

        min_viable_value=int(0.05 * ETH_unit),
        pledged_value=int(0.5 * ETH_unit),
        minimum_bid=int(0.001 * ETH_unit),

        presale_start_time=int(datetime.datetime(2023, 10, 20).timestamp()),
        presale_end_time=int(datetime.datetime(2023, 10, 21).timestamp()),
        presale_price=int(20 * USDC_unit),

        sale_start_time=int(datetime.datetime(2023, 10, 21).timestamp()),
        sale_end_time=int(datetime.datetime(2023, 10, 23).timestamp()),
        sale_price=int(50 * USDC_unit),

        auction_end_time=int(datetime.datetime(2023, 10, 20).timestamp()),
    )

    project_data_json = project.json()
    LOGGER.debug('Project Data JSON: %s', project_data_json)

    bytes_input = CreateProjectInput(
        creator_address=CREATOR_ADDRESS,
        tribe_address=TRIBE_ADDRESS,
        supporter_address=SUPPORTER_ADDRESS,
        project_data=project_data_json.encode('ascii'),
    )

    encoded = '0x' + encode_model(bytes_input).hex()
    return encoded


@pytest.fixture(scope='session')
def dapp_client() -> TestClient:
    client = TestClient(dapp)
    return client


def test_should_create_project(
    dapp_client: TestClient,
    project_creation_payload: str
):
    dapp_client.send_advance(hex_payload=project_creation_payload,
                             msg_sender=settings.FACTORY_ADDRESS)

    assert dapp_client.rollup.status
    assert len(dapp_client.rollup.reports) == 1

    report = dapp_client.rollup.reports[-1]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    assert report['status'] == 'ok'
    assert 'project_id' in report

    assert len(dapp_client.rollup.vouchers) == 1
    assert (
        dapp_client.rollup.vouchers[0]['data']['payload']['destination']
        == TRIBE_ADDRESS
    )


@pytest.mark.order(after='test_should_create_project')
def test_should_list_all_projects(dapp_client: TestClient):
    inspect_payload = '0x' + 'project'.encode('ascii').hex()
    dapp_client.send_inspect(hex_payload=inspect_payload)

    assert dapp_client.rollup.status

    report = dapp_client.rollup.reports[-1]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    assert isinstance(report, list)
    assert 'project_id' in report[0]


@pytest.mark.order(after='test_should_create_project')
def test_should_list_financing_projects(dapp_client: TestClient):
    inspect_payload = '0x' + 'project?state=financing'.encode('ascii').hex()
    dapp_client.send_inspect(hex_payload=inspect_payload)

    assert dapp_client.rollup.status

    report = dapp_client.rollup.reports[-1]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    assert isinstance(report, list)
    assert 'project_id' in report[0]


@pytest.mark.order(after='test_should_create_project')
def test_should_list_construction_projects(dapp_client: TestClient):
    inspect_payload = '0x' + 'project?state=construction'.encode('ascii').hex()
    dapp_client.send_inspect(hex_payload=inspect_payload)

    assert dapp_client.rollup.status

    report = dapp_client.rollup.reports[-1]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    assert isinstance(report, list)
    assert len(report) == 0


@pytest.fixture(scope='session')
def first_project_id(dapp_client: TestClient) -> str:
    report = dapp_client.rollup.reports[0]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    return report['project_id']


@pytest.fixture
def bid_1_payload(first_project_id: str) -> str:
    bid = PlaceBidInput(
        project_id=first_project_id,
        return_rate_pct=5,
    )
    LOGGER.debug("Bid 1 JSON: %s", bid.json())
    deposit = DepositEtherPayload(
        sender=BIDDER_1_ADDRESS,
        depositAmount=0.1 * ETH_unit,
        execLayerData=bid.json().encode('utf-8'),
    )
    encoded = '0x' + encode_model(deposit, packed=True).hex()
    return encoded


@pytest.mark.order(after='test_should_create_project')
def test_should_create_bid(dapp_client: TestClient, bid_1_payload: str):

    dapp_client.send_advance(hex_payload=bid_1_payload,
                             msg_sender=settings.ETHER_PORTAL_ADDRESS,
                             timestamp=5 * 24 * 60 * 60)

    assert dapp_client.rollup.status

    report = dapp_client.rollup.reports[-1]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    assert isinstance(report, dict)
    assert report['placeBid']['bidder'] == BIDDER_1_ADDRESS
    assert report['placeBid']['state'] == 'created'


@pytest.mark.order(after='test_should_create_bid')
def test_should_end_auction(dapp_client: TestClient, first_project_id: str):
    req = {
        'op': 'end_auction',
        'project_id': first_project_id
    }
    req_payload = '0x' + json.dumps(req).encode('ascii').hex()
    dapp_client.send_advance(
        hex_payload=req_payload,
        timestamp=int(datetime.datetime(2023, 10, 20).timestamp())
    )

    assert dapp_client.rollup.status
    assert len(dapp_client.rollup.vouchers) > 0


@pytest.fixture
def mint_payload(first_project_id: str) -> str:
    mint = TribeMintPayload(
        sender=ENDUSER_1_ADDRESS,
    )
    deposit = DepositEtherPayload(
        sender=TRIBE_ADDRESS,
        depositAmount=int(20 * USDC_unit),
        execLayerData=TRIBE_MINT_SIG + encode_model(mint, packed=True),
    )
    encoded = '0x' + encode_model(deposit, packed=True).hex()
    return encoded


@pytest.mark.order(after='test_should_end_auction')
def test_should_perform_sale(dapp_client: TestClient, mint_payload: str):
    dapp_client.send_advance(
        hex_payload=mint_payload,
        msg_sender=settings.ETHER_PORTAL_ADDRESS,
        timestamp=int(datetime.datetime(2023, 10, 20, 12).timestamp())
    )

    assert dapp_client.rollup.status


@pytest.fixture
def mint_affiliate_payload(first_project_id: str) -> str:
    mint = TribeMintWithAffiliatePayload(
        affiliate=AFFILIATE_ADDRESS,
        sender=ENDUSER_2_ADDRESS,
    )
    deposit = DepositEtherPayload(
        sender=TRIBE_ADDRESS,
        depositAmount=int(20 * USDC_unit),
        execLayerData=TRIBE_MINT_AFF_SIG + encode_model(mint, packed=True),
    )
    encoded = '0x' + encode_model(deposit, packed=True).hex()
    return encoded


@pytest.mark.order(after='test_should_end_auction')
def test_should_perform_affiliate_sale(
    dapp_client: TestClient,
    mint_affiliate_payload: str
):
    dapp_client.send_advance(
        hex_payload=mint_affiliate_payload,
        msg_sender=settings.ETHER_PORTAL_ADDRESS,
        timestamp=int(datetime.datetime(2023, 10, 20, 13).timestamp())
    )

    assert dapp_client.rollup.status


@pytest.mark.order(after='test_should_perform_sale')
def test_should_list_buys_on_profile(
    dapp_client: TestClient,
    first_project_id: str
):
    path = f'profile/{ENDUSER_1_ADDRESS}'
    inspect_payload = '0x' + path.encode('ascii').hex()
    dapp_client.send_inspect(hex_payload=inspect_payload)

    assert dapp_client.rollup.status

    report = dapp_client.rollup.reports[-1]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    assert isinstance(report, dict)
    assert 'courses_bought' in report
    assert report['courses_bought'][0]['project_id'] == first_project_id


@pytest.mark.order(after='test_should_perform_sale')
def test_should_list_bids_on_profile(dapp_client: TestClient, first_project_id: str):
    path = f'profile/{BIDDER_1_ADDRESS}'
    inspect_payload = '0x' + path.encode('ascii').hex()
    dapp_client.send_inspect(hex_payload=inspect_payload)

    assert dapp_client.rollup.status

    report = dapp_client.rollup.reports[-1]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    print(json.dumps(report, indent=4))
    assert isinstance(report, dict)
    assert 'bids' in report
    assert report['bids'][0]['project']['project_id'] == first_project_id


@pytest.mark.order(after='test_should_perform_sale')
def test_should_update_on_heartbeat(dapp_client: TestClient, first_project_id: str):

    dapp_client.send_advance(
        hex_payload='0x3defb962',
        timestamp=int(datetime.datetime(2023, 10, 20, 19).timestamp()),
    )

    inspect_payload = '0x' + 'project'.encode('ascii').hex()
    dapp_client.send_inspect(hex_payload=inspect_payload)

    assert dapp_client.rollup.status

    report = dapp_client.rollup.reports[-1]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    assert isinstance(report, list)
    assert 'project_id' in report[0]
    assert report[0]['is_presales']
    assert not report[0]['is_sales']


@pytest.mark.order(after='test_should_update_on_heartbeat')
def test_should_update_on_heartbeat_2(dapp_client: TestClient, first_project_id: str):

    dapp_client.send_advance(
        hex_payload='0x3defb962',
        timestamp=int(datetime.datetime(2023, 10, 22).timestamp()),
    )

    inspect_payload = '0x' + 'project'.encode('ascii').hex()
    dapp_client.send_inspect(hex_payload=inspect_payload)

    assert dapp_client.rollup.status

    report = dapp_client.rollup.reports[-1]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    assert isinstance(report, list)
    assert 'project_id' in report[0]
    assert not report[0]['is_presales']
    assert report[0]['is_sales']
