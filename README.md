# Tribes

This project aims to foster a creator economy, by providing means of gathering
initial resources for the creation of the content through a reverse auction of
financing, and selling the right of access to the created content.

## Tech overview
Our project's technical architecture relies on the establishment of a robust foundation. This foundation comprises essential components, namely Sepolia for Deployment and the Cartesi Execution VM, which form the backbone of the entire system. These components, along with the incorporation of Chainlink technology, are integral to the successful deployment of app-specific rollups and the handling of a complex reverse auction mechanism.

We leveraged [Sepolia](https://sepolia.etherscan.io/) to enable the deployment of app-specific rollups. Sepolia is a valuable tool that streamlines the process of deploying layer 2 solutions. It provided us with a straightforward means to set up and manage our rollups, thus optimizing the deployment process.

The execution layer is a critical component of our project, primarily due to the complexity of the code, which encompasses a reverse auction mechanism. Given the intricacies of the auction code, rendering it impossible to run on the traditional EVM, we opted for the [Cartesi Execution VM](https://docs.cartesi.io/). Cartesi's execution environment offers versatility and higher computational capacity, thanks to its app-specific rollup architecture. This rollup solution is designed to enhance the scalability, computational capabilities, and user experience of decentralized applications (dApps).

We use Sepolia as a data availability layer that maintains a log of inputs specific to DApp rollups. The Cartesi VM processes these inputs, such as auction bids, and is capable of generating verifiable outputs to be executed on the base layer.

While the Cartesi Execution VM allows off-chain computation, it maintains security through a combination of cryptographic proofs and decentralized validation. The results of off-chain computations are periodically anchored back to the layer 1 blockchain, ensuring trust and security. Disputes can be resolved on-chain if disagreements arise.

Additionally, we utilized [Chainlink Datafeeds](https://data.chain.link/) for real-world data streaming and price feeding. This enabled users to charge in USD, covering their real-life content creation costs, while maintaining all financial transactions within the ETH blockchain.

[Chainlink Automation](https://docs.chain.link/chainlink-automation) also played a significant role in our project by enabling us to schedule periodic on-chain jobs. This automation provided a heartbeat, supplying the DApp with the blockchain timestamp at regular intervals.

We integrated [Chainlink Cross-Chain Interoperability Protocol](https://docs.chain.link/ccip) to facilitate cross-chain communication and data transfer. This allowed us to implement multichain functionalities, including the generation of inputs in the Mumbai network that trigger effects on our base layer, Sepolia.
