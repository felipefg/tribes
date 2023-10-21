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
)

from .config import settings
from .models import (
    CreateProjectInput,
    CreateProjectData,
    DepositEtherPayload,
    PlaceBidInput,
)
from . import tribes_db


LOGGER = logging.getLogger(__name__)
logging.basicConfig(level=logging.DEBUG)
dapp = DApp()

abirouter = ABIRouter()
urlrouter = URLRouter()

dapp.add_router(abirouter)
dapp.add_router(urlrouter)


def str2hex(str):
    """Encodes a string as a hex string"""
    return "0x" + str.encode("utf-8").hex()


@abirouter.advance(msg_sender=settings.FACTORY_ADDRESS)
def create_project(rollup: Rollup, data: RollupData) -> bool:

    # Decode data (this should be done by the framework in the future)
    payload = data.bytes_payload()
    LOGGER.debug("Payload: %s", repr(payload))
    project_input = abi.decode_to_model(data=payload, model=CreateProjectInput)
    project_json = project_input.project_data.decode('utf-8')
    project_data = CreateProjectData.parse_obj(json.loads(project_json))

    # Register the project
    project = tribes_db.create_project(
        data=project_data,
        creator_address=project_input.creator_address,
        tribe_address=project_input.tribe_address,
        supporter_address=project_input.supporter_address,
    )

    resp = {
        'project_id': project.project_id,
        'status': 'ok',
        'data': project.dict()
    }
    resp_payload = str2hex(json.dumps(resp))
    rollup.report(payload=resp_payload)
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


@abirouter.advance(msg_sender=settings.ETHER_PORTAL_ADDRESS)
def deposit_ether(rollup: Rollup, data: RollupData) -> bool:

    # Decode data (this should be done by the framework in the future)
    payload = data.bytes_payload()
    LOGGER.debug("Payload: %s", repr(payload))
    deposit = abi.decode_to_model(data=payload, model=DepositEtherPayload)

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
        value=deposit.depositAmount
    )
    print(bid)
    resp = {
        'placeBid': bid.dict()
    }
    resp_payload = str2hex(json.dumps(resp))
    rollup.report(payload=resp_payload)
    return True


if __name__ == '__main__':
    dapp.run()
