# Operations

This document details the operations with the DApp, with brief details on when
each one is called, its expected inputs and outputs.

## Project management

### createProject (advance)

- Sender: TribesFactory contract
- Input: ABI Encoded. with the following schema:

```python
class CreateProjectInput(BaseModel):
    name: str
    description: str
    tribes_addr: abi.Address # Address of corresponding Tribe contract
    supporter_addr: abi.Address # Address of corresponding Supporter contract
    max_revenue_share: int
    min_viable_value: int
    pledged_value: int
    auction_duration_secs: int
    minimum_bid: int
    regular_price: int
    presale_price: int
    state: enum # Financing, Production, Sales
```

Output: Notice:

```python
class CreateProjectNotice(BaseModel):
    project_id: str
    name: str
```

### listProjects (inspect)

Path: `/project/`

Output: JSON, a list of objects like

```python
class ListProjectOutput(BaseModel):
    name: str
    description: str
    creator: abi.Address
    member_erc1155: abi.Address
    financer_erc20: abi.Address
    archetypes: list[str]

    max_revenue_share: int
    min_viable_value: int
    pledged_value: int
    auction_duration_secs: int
    minimum_bid: int
    regular_price: int
    presale_price: int
    state: enum # Financing, Production, Sales
```

### detailProject (inspect)

```python
class CreateArchetypeInput(BaseModel):
    name: str
    description: str
    creator: abi.Address
    member_erc1155: abi.Address
    financer_erc20: abi.Address
    archetypes: list[str]

    max_revenue_share: int
    min_viable_value: int
    pledged_value: int
    auction_duration_secs: int
    minimum_bid: int
    regular_price: int
    presale_price: int
    state: enum # Financing, Production, Sales

    final_revenue_share: int

    total_bidded: int
    num_bids: int

    total_presales: int
    num_sales: int
```

### createArchetype (advance)

Input:

```python
class CreateArchetypeInput(BaseModel):
    project_id: str
    name: str
    return_model: enum # Content, Revenue, Commission
    commission_factor: float = None
    revenue_factor: float = None
```

### userProfile (inspect)

Path: `/projects/{address}`

## Bidding

### placeBid

Input: JSON

```python
class PlaceBidInput(BaseModel):
    project_id: str
    archetype_name: str
    value: int
    rate: float
```

Output: Notice

```python
class PlaceBidOutput(BaseModel):
    project_id: str
    archetype_name: str
    value: int
    rate: float
```

## Subscription

## Wallet

### getBalance (inspect)

Path: `/balance/{address}`

Output:

```json
{
    "ether": "<value, abi enconded uint256>",
    "erc20": {
        "<address>": "<value, abi enconded uint256>",
    },
    "erc1155": {
        "<address>": {
            "<token id>": "<value, abi enconded uint256>",
        },
    }
}
```

### ERC20_Deposit (advance)

### ERC20_Withdraw (advance)
