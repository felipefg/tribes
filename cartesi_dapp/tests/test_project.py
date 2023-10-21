import pytest
import json

from cartesi.testclient import TestClient

from cartesi.abi import encode_model

from tribes.dapp import dapp
from tribes.models import (
    CreateProjectData,
    CreateProjectInput,
    PlaceBidInput,
    DepositEtherPayload,
)

from tribes.config import settings


CREATOR_ADDRESS = "0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199"
TRIBE_ADDRESS = "0x721be000f6054b5e0e57aaab791015b53f0a18f4"
SUPPORTER_ADDRESS = "0x50090000689e92897b819e039327479c0b123495"

BIDDER_1_ADDRESS = "0xb1d0010a694ddef7f4bdaac3f04ccacee4d5ffff"

ETH_unit = int(1e18)
USDC_unit = int(1e6)


@pytest.fixture
def project_creation_payload() -> str:
    """Generate a project creation payload"""

    project = CreateProjectData(
        name="Test Project",
        description="This is the **best** project ever!!",

        max_revenue_share=int(0.001 * ETH_unit),
        min_viable_value=int(0.05 * ETH_unit),
        pledged_value=int(0.5 * ETH_unit),
        minimum_bid=int(0.001 * ETH_unit),

        regular_price=int(50 * USDC_unit),
        presale_price=int(20 * USDC_unit),
        auction_duration_secs=7 * 24 * 60 * 60,  # 7 days
    )

    project_data_json = project.json()

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
def place_bid_payload(first_project_id: str) -> str:
    bid = PlaceBidInput(
        project_id=first_project_id,
        archetype_name='supporter',
        rate=1000
    )
    deposit = DepositEtherPayload(
        sender=BIDDER_1_ADDRESS,
        depositAmount=0.1 * ETH_unit,
        execLayerData=bid.json().encode('utf-8'),
    )
    encoded = '0x' + encode_model(deposit).hex()
    return encoded


@pytest.mark.order(after='test_should_create_project')
def test_should_create_bid(dapp_client: TestClient, place_bid_payload: str):

    dapp_client.send_advance(hex_payload=place_bid_payload,
                             msg_sender=settings.ETHER_PORTAL_ADDRESS)

    assert dapp_client.rollup.status

    report = dapp_client.rollup.reports[-1]['data']['payload']
    report = bytes.fromhex(report[2:])
    report = json.loads(report.decode('utf-8'))
    assert isinstance(report, dict)
    assert report['placeBid']['bidder'] == BIDDER_1_ADDRESS
