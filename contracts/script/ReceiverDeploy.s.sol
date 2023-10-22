// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {Receiver} from "@contracts/ccip/Receiver.sol";
import {SetupReceiver} from "@script/utils/SetupReceiver.sol";

contract ReceiverDeploy is Script {
    SetupReceiver helperConfigReceiver = new SetupReceiver();

    function run() external {
        (address _router, address _target) = helperConfigReceiver
            .setupReceiverArgs();

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        Receiver receiver = new Receiver(_router, _target);
        vm.stopBroadcast();

        console.log("Receiver Address: %s;", address(receiver));
    }
}
