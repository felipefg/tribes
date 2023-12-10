import json
import logging

from cartesi import abi
from cartesi import (
    DApp,
    Rollup,
    RollupData,
    ABIRouter,
    URLRouter,
    URLParameters,
    JSONRouter,
    ABIFunctionSelectorHeader,
)

from .config import settings
from .models import (
    CreateProjectInput,
    CreateProjectData,
    DepositEtherPayload,
    PlaceBidInput,
    EndAuctionPayload,
    TribeMintPayload,
    TribeMintWithAffiliatePayload,
)
from . import tribes_db, vouchers, auction
from .admin import adminrouter


LOGGER = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)
dapp = DApp()

abirouter = ABIRouter()
urlrouter = URLRouter()
jsonrouter = JSONRouter()

dapp.add_router(abirouter)
dapp.add_router(urlrouter)
dapp.add_router(jsonrouter)
dapp.add_router(adminrouter)

DAPP_ADDRESS = None


def str2hex(str):
    """Encodes a string as a hex string"""
    return "0x" + str.encode("utf-8").hex()


@abirouter.advance(msg_sender=settings.ADDR_RELAY_ADDRESS)
def address_relay(rollup: Rollup, data: RollupData) -> bool:
    global DAPP_ADDRESS
    LOGGER.debug('Got DApp address %s', data.payload)
    DAPP_ADDRESS = data.payload
    return True


@abirouter.advance(msg_sender=settings.FACTORY_ADDRESS)
def create_project(rollup: Rollup, data: RollupData) -> bool:

    # Decode data (this should be done by the framework in the future)
    payload = data.bytes_payload()
    LOGGER.debug("Payload: %s", payload.hex())

    project_input = abi.decode_to_model(data=payload, model=CreateProjectInput)
    project_json = project_input.project_data.decode('utf-8')
    project_data = CreateProjectData.parse_obj(json.loads(project_json))

    # Register the project
    project = tribes_db.create_project(
        data=project_data,
        creator_address=project_input.creator_address,
        tribe_address=project_input.tribe_address,
        supporter_address=project_input.supporter_address,
        timestamp=data.metadata.timestamp,
    )

    resp = {
        'project_id': project.project_id,
        'status': 'ok',
        'data': project.dict()
    }
    resp_payload = str2hex(json.dumps(resp))
    rollup.report(payload=resp_payload)

    rollup.voucher(
        vouchers.launch_strategy(
            tribe_address=project.tribe_address,
            presale_start_time=project.presale_start_time,
            presale_end_time=project.presale_end_time,
            presale_price=project.presale_price,
            sale_start_time=project.sale_start_time,
            sale_end_time=project.sale_end_time,
            sale_price=project.sale_price,
        )
    )
    return True


@urlrouter.inspect(path='project')
def list_projects(rollup: Rollup, data: RollupData, params: URLParameters):

    filters = {}
    if 'state' in params.query_params:
        filters['filter_state'] = params.query_params['state'][0]

    projects = tribes_db.gen_projects(**filters)
    resp = [x.dict() for x in projects]
    resp_payload = str2hex(json.dumps(resp))
    rollup.report(payload=resp_payload)
    return True


def _get_selector_bytes(sig) -> bytes:
    from Crypto.Hash import keccak
    sig_hash = keccak.new(digest_bits=256)
    sig_hash.update(sig.encode('utf-8'))
    return sig_hash.digest()[:4]


TRIBE_MINT_SIG = _get_selector_bytes('mint(uint256)')
TRIBE_MINT_AFF_SIG = _get_selector_bytes('mintWithAffiliate(uint256,address)')


@abirouter.advance(msg_sender=settings.ETHER_PORTAL_ADDRESS)
def deposit_ether(rollup: Rollup, data: RollupData) -> bool:

    # Decode data (this should be done by the framework in the future)
    payload = data.bytes_payload()
    LOGGER.debug("Payload: %s", payload.hex())

    deposit = abi.decode_to_model(data=payload, model=DepositEtherPayload,
                                  packed=True)

    if deposit.execLayerData.startswith(TRIBE_MINT_SIG):
        return _handle_direct_buy(rollup, data, deposit)

    if deposit.execLayerData.startswith(TRIBE_MINT_AFF_SIG):
        return _handle_affiliate_buy(rollup, data, deposit)

    try:
        deposit_data = deposit.execLayerData.decode('utf-8')
        bid_input = PlaceBidInput.parse_obj(json.loads(deposit_data))
    except Exception:
        LOGGER.error("Error parsing PlaceBidInput", exc_info=True)
        # TODO: voucher to return the value
        raise

    bid = tribes_db.place_bid(
        bid_input=bid_input,
        sender=deposit.sender,
        volume=deposit.depositAmount,
        timestamp=data.metadata.timestamp,
    )

    resp = {
        'placeBid': bid.dict()
    }
    resp_payload = str2hex(json.dumps(resp))
    rollup.report(payload=resp_payload)
    return True


def _handle_direct_buy(
    rollup: Rollup,
    data: RollupData,
    deposit: DepositEtherPayload
) -> bool:
    LOGGER.info("Handling direct buy of course")
    mint_data = abi.decode_to_model(
        data=deposit.execLayerData[4:],
        model=TribeMintPayload,
        packed=True
    )

    # Register Buyer
    project = tribes_db.get_project_by_tribe(deposit.sender)
    if project is None:
        return False
    tribes_db.register_buyer(mint_data.sender, project)
    # TODO: Pay creator
    # TODO: Pay supporters
    return True


def _handle_affiliate_buy(
    rollup: Rollup,
    data: RollupData,
    deposit: DepositEtherPayload
) -> bool:
    LOGGER.info("Handling affiliate buy of course")
    mint_data = abi.decode_to_model(
        data=deposit.execLayerData[4:],
        model=TribeMintWithAffiliatePayload,
        packed=True
    )

    # Register Buyer
    project = tribes_db.get_project_by_tribe(deposit.sender)
    if project is None:
        return False
    tribes_db.register_buyer(mint_data.sender, project)
    return True


@jsonrouter.advance({'op': 'end_auction'})
def end_auction(rollup: Rollup, data: RollupData) -> bool:

    payload = data.json_payload()
    payload = EndAuctionPayload(**payload)

    project, vinfos = tribes_db.end_auction(payload.project_id,
                                            data.metadata.timestamp)

    for vinfo in vinfos:

        if vinfo.operation == auction.TokenOperation.TRANSFER:
            voucher = vouchers.withdraw_ether(
                rollup_address=DAPP_ADDRESS,
                receiver_address=vinfo.to,
                amount=int(vinfo.amount),
            )
        else:
            voucher = vouchers.mint_supporter_tokens(
                supporter_contract=project.supporter_address,
                supporter_address=vinfo.to,
                amount=int(vinfo.amount),
            )
        rollup.voucher(voucher)
    return True


@urlrouter.inspect(path='profile/{wallet}')
def get_profile(rollup: Rollup, data: RollupData, params: URLParameters):
    wallet = params.path_params['wallet'].lower()
    resp = {
        'courses_bought': [
            x.dict() for x in tribes_db.list_courses_for_buyer(wallet)
        ],
        'bids': [
            x.dict() for x in tribes_db.list_bids_for_address(wallet)
        ],
        'projects_created': [
            x.dict() for x in tribes_db.list_courses_for_creator(wallet)
        ],
    }
    resp_payload = str2hex(json.dumps(resp))
    rollup.report(payload=resp_payload)
    return True


@abirouter.advance(
    header=ABIFunctionSelectorHeader(function='heartbeat', argument_types=[])
)
def heartbeat(rollup: Rollup, data: RollupData):
    tribes_db.heartbeat(data.metadata.timestamp)
    return True


@abirouter.advance(
    msg_sender=settings.ADMIN_ADDRESS,
)
def admin_voucher(rollup: Rollup, data: RollupData):
    voucher = data.json_payload()
    rollup.voucher(voucher)
    return True


if __name__ == '__main__':
    dapp.run()
