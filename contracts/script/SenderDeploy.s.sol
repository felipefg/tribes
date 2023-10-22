// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {Sender} from "@contracts/ccip/Sender.sol";
import {SetupSender} from "@script/utils/SetupSender.sol";

contract SenderDeploy is Script {
    SetupSender helperConfigSender = new SetupSender();

    function run() external {
        (
            address _router,
            address _target,
            uint64 _destinationChainSelector
        ) = helperConfigSender.setupSenderArgs();

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        Sender sender = new Sender(_router, _target, _destinationChainSelector);
        vm.stopBroadcast();

        console.log("Sener Address: %s;", address(sender));
    }
}
