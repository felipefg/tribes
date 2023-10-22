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
    max_price_auction: int
    min_viable_value: int
    pledged_value: int
    auction_end_time: int
    minimum_bid: int
    presale_start_time: int
    presale_end_time: int
    presale_price: int
    sale_start_time: int
    sale_end_time: int
    sale_price: int


class Project(BaseModel):
    project_id: str = Field(default_factory=lambda: str(uuid4()))
    name: str
    description: str
    created_at: int
    max_price_auction: int
    final_price_auction: int | None = None
    min_viable_value: int
    pledged_value: int
    auction_end_time: int
    minimum_bid: int
    presale_start_time: int
    presale_end_time: int
    presale_price: int
    sale_start_time: int
    sale_end_time: int
    sale_price: int
    presales: bool = True
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
    role_id: int
    price: float


class BidState(str, Enum):
    created = 'created'
    accepted = 'accepted'
    partial = 'partial'
    rejected = 'rejected'


class Bid(BaseModel):
    state: BidState = BidState.created
    bidder: abi.Address
    role_id: int
    volume: abi.UInt256
    volume_fulfilled: float | None = None
    price: float
    timestamp: int



class EndAuctionPayload(BaseModel):
    op: Literal['end_auction'] = 'end_auction'
    project_id: str
