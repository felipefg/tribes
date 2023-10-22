// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TribesFactory} from "@contracts/factory/TribesFactory.sol";
import {Client} from "@chainlink/contracts-ccip/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/ccip/applications/CCIPReceiver.sol";

/**
 * THIS IS AN EXAMPLE CONTRACT THAT USES HARDCODED VALUES FOR CLARITY.
 * THIS IS AN EXAMPLE CONTRACT THAT USES UN-AUDITED CODE.
 * DO NOT USE THIS CODE IN PRODUCTION.
 */
contract Receiver is CCIPReceiver {
    TribesFactory tribesFactory;

    event MintCallSuccessfull();

    constructor(address router, address target) CCIPReceiver(router) {
        tribesFactory = TribesFactory(target);
    }

    /**
     * @notice CCIP Implementation
     * @param message The CCIP-101 message sent to this contract
     */
    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (bool success, ) = address(tribesFactory).call(message.data); // message.data = abi.encodeWithSignature("createTribe(string,bytes)", cid, input)
        require(success);
        emit MintCallSuccessfull();
    }
}