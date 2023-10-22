# Tribes Contracts 📚

> [!IMPORTANT]
> For the development of the contracts, Foundry was used. Follow the installation instructions for the required prerequisites to proceed with the tutorial below: [requirements](https://book.getfoundry.sh/getting-started/installation)

Welcome to the project documentation! This repository contains essential documentation to guide you through the setup and usage of the project. As a submodule of the Tribes Cartesi Machine ( Execution Layer ), it plays a crucial role in ensuring smooth operations. Follow the steps below to get started:

## 1. Setting Up Environment 🌍

- Before you begin, make sure you have the required environment variables properly configured. Create an environment by executing the following command:

    ```bash
    $ make setup
    ```

- Ensure you provide the necessary parameters in the generated .env file.

## 2. Deployment 🚀

- As we are using the Foundry framework to develop robustness contracts, an important change must be made in the rollup submodule:

    ```bash
    $ cat lib/rollups-contracts/onchain/rollups/contracts/dapp/CartesiDApp.sol
    ```

    - Change line 14 to ```import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";``` instead ```import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";```.

### 2.1 Deploy on testnet 🌐

- To implement the system in testnet, run the command below:

    ```bash
    $ make deploy CONFIG="--network <NETWORK_NAME>"
    ```

- ⚠️ Supported Networks:
    - sepolia
    - mumbai

> [!WARNING] 
> The next step is crucial to ensure that future interactions with the application are done correctly.

### 2.2 Setup CartesiDApp:

- To inform the contract of the Cartesi DApp's deployed address on the respective network, run the following command:

    ```bash
    $ make cartesi contract="<TRIBES_FACTORY_CONTRACT_ADDRESS>" dapp="<CARTESI_DAPP>" CONFIG="--network <NETWORK_NAME>"
    ```

## 3. Chainlink CCIP:

- With CCIP from the Polygon Mumbai network, a creator can build a project on the execution layer infrastructure and deploy contracts on Sepolia.

### 3.1 Deploy Sender Contract ( Polygon ):

- Run the command bellow:

    ```bash
    $ make ccip_sender CONFIG="--network mumbai"
    ```

### 3.2 Deploy Receiver Contract ( Sepolia ):

- Run the command bellow:

    ```bash
    $ make ccip_receiver CONFIG="--network sepolia"
    ```

## 4. Viewing Documentation Locally 💻

View the generated documentation locally by serving it on a local server at port 4001. Use:

```bash
$ forge doc --serve --port 4001
```

Access the documentation through your web browser by navigating to <http://localhost:4001>.

## 5. Contracts on Explorer:

 - Sender: https://mumbai.polygonscan.com/address/0x255091a4ba6bdcf1a1f6cd4d1a40e4cd29a17922
 - Receiver: https://sepolia.etherscan.io/address/0x6c8d71e7b9d31e5c6345320c387224cf67ec55c5
 - Tribes Factory: https://sepolia.etherscan.io/address/0xd4422b65a548bf3c17a19ee1d6cf6748b2ca4653
 - UpKeep: 0x4aB213e47c39d94dedEAF2d2EBd2C2cd7917007e
