// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {TribesFactory} from "@contracts/factory/TribesFactory.sol";
import {SetupTribesFactory} from "@script/utils/SetupTribesFactory.sol";

contract TribesFactoryDeploy is Script {
    SetupTribesFactory helperConfigLiliumFactory = new SetupTribesFactory();

    function run() external {
        (
            address _inputBox,
            address _etherPortal,
            address _priceFeed
        ) = helperConfigLiliumFactory.tribesFactoryArgs();

        vm.startBroadcast(vm.envUint("PRIVATE_KEY"));
        TribesFactory tribesFactory = new TribesFactory(
            _inputBox,
            _etherPortal,
            _priceFeed
        );
        vm.stopBroadcast();

        console.log("Tribes Factory Address: %s;", address(tribesFactory));
    }
}
