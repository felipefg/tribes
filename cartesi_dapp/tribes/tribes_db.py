"""
In-memory data store for tribes
"""
import logging

from cartesi import abi

from . import models, auction


LOGGER = logging.getLogger(__name__)

# Dictionary mapping project_id to its Project model
PROJECTS = {}

# Dictionary mapping project_id to a list of bids
BIDS = {}


def create_project(
    data: models.CreateProjectData,
    creator_address: abi.Address,
    tribe_address: abi.Address,
    supporter_address: abi.Address,
    timestamp: int,
) -> models.Project:

    project = models.Project(
        creator_address=creator_address,
        tribe_address=tribe_address,
        supporter_address=supporter_address,
        created_at=timestamp,
        **data.dict()
    )

    PROJECTS[project.project_id] = project

    return project


def gen_projects(filter_state: str = None):

    for proj in PROJECTS.values():
        if filter_state is not None and proj.state != filter_state:
            continue
        yield proj


def place_bid(
    bid_input: models.PlaceBidInput,
    sender: abi.Address,
    volume: int,
    timestamp: int
) -> models.Bid | None:

    project: models.Project = PROJECTS.get(bid_input.project_id)
    if project is None:
        LOGGER.info("Auction for project %s not found.", bid_input.project_id)
        return None

    bid = models.Bid(
        bidder=sender,
        volume=volume,
        role_id=bid_input.role_id,
        price=bid_input.price,
        timestamp=timestamp,
    )

    if bid.volume < project.minimum_bid:
        bid.state = models.BidState.rejected

    BIDS.setdefault(project.project_id, []).append(bid)
    return bid


def end_auction(project_id: str, timestamp: int):

    project: models.Project = PROJECTS.get(project_id)
    if project is None:
        LOGGER.info("Auction for project %s not found.", project_id)
        return None, None

    if timestamp < project.auction_end_time:
        LOGGER.info("Auction for project %s can only be terminated after %d",
                    project.project_id, project.auction_end_time)
        return None, None

    if project.state != models.ProjectStates.financing:
        LOGGER.info("Auction %s is no longer in financing state.",
                    project.project_id)
        return None, None

    bids: list[models.Bid] = BIDS.get(project_id, [])

    a_bids = [
        auction.Bid(
            auction_id=project.project_id,
            timestamp=bid.timestamp,
            volume=bid.volume,
            price=bid.price,
            bidder=bid.bidder,
            meta=bid,
        )
        for bid in bids
        if bid.state == models.BidState.created
    ]

    total_accrued = sum(bid.volume for bid in a_bids)
    assert total_accrued >= project.min_viable_value, f'Accrued {total_accrued:_}'

    # TODO: Take into account the presales total!!
    volume_limit = min(project.pledged_value, total_accrued)

    auction_output = auction.auction_output(
        bids=a_bids,
        volume_limit=volume_limit
    )

    final_price = auction.auction_price(auction_output)

    vouchers = auction.auction_vouchers(auction_output.bid_outputs, final_price)
    vouchers = list(vouchers)

    # Advance the state of the project to construction
    project.state = models.ProjectStates.construction
    project.final_price_auction = final_price

    # Set final bid states
    for bidout in auction_output.bid_outputs:
        bidout.meta.volume_fulfilled = bidout.amount_fullfiled

        if bidout.amount_fullfiled == 0:
            bidout.meta.state = models.BidState.rejected
        elif bidout.amount_fullfiled < bidout.amount_sent:
            bidout.meta.state = models.BidState.partial
        else:
            bidout.meta.state = models.BidState.accepted

    return project, vouchers
