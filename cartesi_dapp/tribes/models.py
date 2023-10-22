"""
Data models for operations
"""
from enum import Enum
from typing import Literal
from uuid import uuid4

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
    creator_rate_pct: float
    affiliate_rate_pct: float
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
    creator_rate_pct: float
    affiliate_rate_pct: float
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
    is_presales: bool = False
    is_sales: bool = False
    state: ProjectStates = ProjectStates.financing
    creator_address: abi.Address
    tribe_address: abi.Address
    supporter_address: abi.Address
    total_bidded: int = 0
    total_financed: int | None = None
    final_price_auction: float | None = None


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
    return_rate_pct: float


class BidState(str, Enum):
    created = 'created'
    accepted = 'accepted'
    partial = 'partial'
    rejected = 'rejected'


class Bid(BaseModel):
    state: BidState = BidState.created
    project: Project
    bidder: abi.Address
    volume: abi.UInt256
    volume_fulfilled: float | None = None
    return_rate_pct: float
    price: float
    timestamp: int


class ClaimAffiliationPayload(BaseModel):
    affiliate_address: abi.Address


class EndAuctionPayload(BaseModel):
    op: Literal['end_auction'] = 'end_auction'
    project_id: str


class TribeMintPayload(BaseModel):
    sender: abi.Address


class TribeMintWithAffiliatePayload(BaseModel):
    affiliate: abi.Address
    sender: abi.Address
