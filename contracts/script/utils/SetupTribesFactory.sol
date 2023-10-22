// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract SetupTribesFactory {
    struct TribesFactoryArgs {
        address inputBox;
        address etherPortal;
        address priceFeed;
    }

    TribesFactoryArgs public tribesFactoryArgs;

    mapping(uint256 => TribesFactoryArgs) public chainIdToNetworkConfig;

    constructor() {
        chainIdToNetworkConfig[11155111] = getSepoliaLiliumArgs();
        chainIdToNetworkConfig[80001] = getMumbaiLiliumArgs();
        tribesFactoryArgs = chainIdToNetworkConfig[block.chainid];
    }

    function getSepoliaLiliumArgs()
        internal
        pure
        returns (TribesFactoryArgs memory sepoliaNetworkConfig)
    {
        sepoliaNetworkConfig = TribesFactoryArgs({
            inputBox: 0x59b22D57D4f067708AB0c00552767405926dc768,
            etherPortal: 0xFfdbe43d4c855BF7e0f105c400A50857f53AB044,
            priceFeed: 0x694AA1769357215DE4FAC081bf1f309aDC325306 // ETH / USD
        });
    }

    function getMumbaiLiliumArgs()
        internal
        pure
        returns (TribesFactoryArgs memory mumbaiNetworkConfig)
    {
        mumbaiNetworkConfig = TribesFactoryArgs({
            inputBox: 0x59b22D57D4f067708AB0c00552767405926dc768,
            etherPortal: 0xFfdbe43d4c855BF7e0f105c400A50857f53AB044,
            priceFeed: 0x0715A7794a1dc8e42615F059dD6e406A6594651A // ETH / USD
        });
    }
}
