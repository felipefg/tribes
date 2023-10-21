"""
Data models for operations
"""
from enum import Enum
from typing import Literal
from uuid import UUID, uuid4

from cartesi import abi
from pydantic import BaseModel, Field


class CreateProjectInput(BaseModel):
    """Payload for the CreateProjectInput"""
    creator_address: abi.Address
    tribe_address: abi.Address
    supporter_address: abi.Address
    project_data: bytes


class ProjectStates(str, Enum):
    financing = 'financing'
    construction = 'construction'
    commercialization = 'commercialization'


class CreateProjectData(BaseModel):
    name: str
    description: str
    max_revenue_share: int
    min_viable_value: int
    pledged_value: int
    auction_duration_secs: int
    minimum_bid: int
    regular_price: int
    presale_price: int


class Project(BaseModel):
    project_id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    description: str
    max_revenue_share: int
    min_viable_value: int
    pledged_value: int
    auction_duration_secs: int
    minimum_bid: int
    regular_price: int
    presale_price: int
    state: ProjectStates = ProjectStates.financing
    creator_address: abi.Address
    tribe_address: abi.Address
    supporter_address: abi.Address


class DepositEtherPayload(BaseModel):
    sender: abi.Address
    depositAmount: abi.UInt256
    execLayerData: bytes


class DepositERC20Payload(BaseModel):
    success: abi.Bool
    token: abi.Address
    sender: abi.Address
    depositAmount: abi.UInt256
    execLayerData: bytes


class PlaceBidInput(BaseModel):
    op: Literal['place_bid'] = 'place_bid'
    project_id: str
    archetype_name: str
    rate: int


class BidState(str, Enum):
    created = 'created'
    accepted = 'accepted'
    rejected = 'rejected'


class Bid(BaseModel):
    state: BidState = BidState.created
    bidder: abi.Address
    archetype_name: str
    value: int
    rate: int
