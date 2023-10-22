// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Withdraw} from "@utils/Withdraw.sol";
import {Client} from "@chainlink/contracts-ccip/ccip/libraries/Client.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/ccip/interfaces/IRouterClient.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract Sender is Withdraw {
    enum PayFeesIn {
        Native,
        LINK
    }

    address immutable i_router;
    address immutable i_target;
    uint64 private i_destinationChainSelector;

    event MessageSent(bytes32 messageId);

    constructor(
        address router, // Polygon router: 0x3C3D92629A02a8D95D5CB9650fe49C3544f69B43
        address target,
        uint64 destinationChainSelector // Polygon: 12532609583862916517, Sepolia: 16015286601757825753
    ) {
        i_router = router;
        i_target = target;
        i_destinationChainSelector = destinationChainSelector;
    }

    receive() external payable {}

    function mint(string memory cid, bytes memory input) external {
        // destinationChainSelector = 12532609583862916517 (polygon) or 16015286601757825753 (sepolia)
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            receiver: abi.encode(i_target),
            data: abi.encodeWithSignature(
                "createTribe(string,bytes)",
                cid,
                input
            ),
            // data: abi.encodeWithSignature(
            //     "heartbeat()"
            // ),
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: "",
            feeToken: address(0)
        });

        uint256 fee = IRouterClient(i_router).getFee(
            i_destinationChainSelector,
            message
        );

        bytes32 messageId;
        messageId = IRouterClient(i_router).ccipSend{value: fee}(
            i_destinationChainSelector,
            message
        );

        emit MessageSent(messageId);
    }
}
