// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract SetupSender {
    struct SetupSenderArgs {
        address router;
        address target;
        uint64 destinationChainSelector;
    }

    SetupSenderArgs public setupSenderArgs;

    mapping(uint256 => SetupSenderArgs) public chainIdToNetworkConfig;

    constructor() {
        chainIdToNetworkConfig[11155111] = getSepoliaLiliumArgs();
        chainIdToNetworkConfig[80001] = getMumbaiLiliumArgs();
        setupSenderArgs = chainIdToNetworkConfig[block.chainid];
    }

    function getSepoliaLiliumArgs()
        internal
        pure
        returns (SetupSenderArgs memory sepoliaNetworkConfig)
    {
        sepoliaNetworkConfig = SetupSenderArgs({
            router: 0xD0daae2231E9CB96b94C8512223533293C3693Bf,
            target: 0x08cE191d7d066e9A5636CE094e343288aCa7B20D,
            destinationChainSelector: 16015286601757825753 // Sepolia: 16015286601757825753
        });
    }

    function getMumbaiLiliumArgs()
        internal
        pure
        returns (SetupSenderArgs memory mumbaiNetworkConfig)
    {
        mumbaiNetworkConfig = SetupSenderArgs({
            router: 0x70499c328e1E2a3c41108bd3730F6670a44595D1,
            target: 0x08cE191d7d066e9A5636CE094e343288aCa7B20D,
            destinationChainSelector: 12532609583862916517 // Polygon: 12532609583862916517
        });
    }
}
