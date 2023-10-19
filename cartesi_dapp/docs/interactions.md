# Interactions

This lists the basic interaction among the different components of the system.

Components:

- **Frontend** - JavaScript frontend
- **Cartesi Dapp** - Python DApp on the Cartesi runtime
- **TribesFactory** - Layer 1 contract factory for creating the Supporter and Tribe Contract
- **Tribe Contract** - Layer 1 contract for managing the sales of a single course and NFT minting
- **Supporter Contract** - Layer 1 contract for managing the token minting for the supporters and affiliates/KOLs
- **Tribe Member** - Wallet of the Tribe member (who bought access to the project)
- **Supporter Wallets** - Wallet of the Supporter of a project

```mermaid
sequenceDiagram
    participant Frontend
    participant factory as Tribes Factory
    participant dapp as Cartesi DAPP

    note over Frontend,dapp: Project creation
    Frontend->>factory: CreateProject
    activate factory

    create participant tribe as Tribe Contract
    factory->>tribe: Deploy

    create participant sup as Supporter Contract
    factory->>sup: Deploy

    factory->>dapp: CreateProjectInput
    deactivate factory

    note over Frontend,dapp: Buy Course

    Frontend->>tribe: mint() payable
    activate tribe

    create actor member as Tribe Member
    tribe->>member: NFT

    tribe->>dapp: Sale (address, value)
    deactivate tribe

    note over Frontend,dapp: Auction Finished
    dapp->>sup: Vouchers for each supporter
    activate sup
    create actor supwallet as Supporter Wallets
    sup->>supwallet: Tokens / NFTs
    deactivate sup
```
