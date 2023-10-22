// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract SetupReceiver {
    struct SetupReceiverArgs {
        address router;
        address target;
    }

    SetupReceiverArgs public setupReceiverArgs;

    mapping(uint256 => SetupReceiverArgs) public chainIdToNetworkConfig;

    constructor() {
        chainIdToNetworkConfig[11155111] = getSepoliaLiliumArgs();
        chainIdToNetworkConfig[80001] = getMumbaiLiliumArgs();
        setupReceiverArgs = chainIdToNetworkConfig[block.chainid];
    }

    function getSepoliaLiliumArgs()
        internal
        pure
        returns (SetupReceiverArgs memory sepoliaNetworkConfig)
    {
        sepoliaNetworkConfig = SetupReceiverArgs({
            router: 0xD0daae2231E9CB96b94C8512223533293C3693Bf,
            target: 0x08cE191d7d066e9A5636CE094e343288aCa7B20D
        });
    }

    function getMumbaiLiliumArgs()
        internal
        pure
        returns (SetupReceiverArgs memory mumbaiNetworkConfig)
    {
        mumbaiNetworkConfig = SetupReceiverArgs({
            router: 0x70499c328e1E2a3c41108bd3730F6670a44595D1,
            target: 0x08cE191d7d066e9A5636CE094e343288aCa7B20D
        });
    }
}
