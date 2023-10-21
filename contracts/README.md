# Tribes Contracts 📚

> [!IMPORTANT]
> For the development of the contracts, Foundry was used. Follow the installation instructions for the required prerequisites to proceed with the tutorial below: [requirements](https://book.getfoundry.sh/getting-started/installation)

Welcome to the project documentation! This repository contains essential documentation to guide you through the setup and usage of the project. As a submodule of the Tribes Cartesi Machine ( Execution Layer ), it plays a crucial role in ensuring smooth operations. Follow the steps below to get started:

## 1. Setting Up Environment 🌍

- Before you begin, make sure you have the required environment variables properly configured. Create an environment by executing the following command:

    ```bash
    $ make env
    ```

- Ensure you provide the necessary parameters in the generated environment file.

## 2. Deployment 🚀

- As we are using the Foundry framework to develop robustness contracts, an important change must be made in the rollup submodule:

    ```bash
    $ cat lib/rollups-contracts/onchain/rollups/contracts/dapp/CartesiDApp.sol
    ```

    - Change line 14 to ```import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";``` instead ```import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";```.

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
    $ make cartesi contract="<TRIBES_FACTORY_CONTRACT_ADDRESS>" dapp="<CARTESI_DAPP>" CONFIG="--network sepolia"
    ```
    
## 3. System Architecture 📐
<p align="center">
<img src="https://github.com/Lilium-DApp/foundry/assets/89201795/e02bef58-5e9a-4d15-b65f-fe4dc7fec9d8" width="800" height="600" />
<p>

## 4. Viewing Documentation Locally 💻

View the generated documentation locally by serving it on a local server at port 4001. Use:

```bash
$ forge doc --serve --port 4001
```

Access the documentation through your web browser by navigating to <http://localhost:4001>.