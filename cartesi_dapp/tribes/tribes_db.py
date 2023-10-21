"""
In-memory data store for tribes
"""
from cartesi import abi

from . import models


# Dictionary mapping project_id to its Project model
PROJECTS = {}

# Dictionary mapping project_id to a list of bids
BIDS = {}


def create_project(
    data: models.CreateProjectData,
    creator_address: abi.Address,
    tribe_address: abi.Address,
    supporter_address: abi.Address,
) -> models.Project:

    project = models.Project(
        creator_address=creator_address,
        tribe_address=tribe_address,
        supporter_address=supporter_address,
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
    value: int
) -> models.Bid | None:

    project: models.Project = PROJECTS.get(bid_input.project_id)
    if project is None:
        return None

    bid = models.Bid(
        bidder=sender,
        value=value,
        archetype_name=bid_input.archetype_name,
        rate=bid_input.rate,
    )

    if bid.value < project.minimum_bid:
        bid.state = models.BidState.rejected

    BIDS.setdefault(project.project_id, []).append(bid)
    return bid
