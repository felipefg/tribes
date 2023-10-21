//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {MockV3Aggregator} from "@mock/MockV3Aggregator.sol";
import {InputBox} from "@cartesi/contracts/inputs/InputBox.sol";
import {TribesFactory} from "@contracts/factory/TribesFactory.sol";
import {EtherPortal} from "@cartesi/contracts/portals/EtherPortal.sol";

contract TribesFactoryTest is Test {
    address platform = vm.addr(1);
    address creator = vm.addr(2);
    address cartesiDappTest = vm.addr(3);
    uint8 public constant DECIMALS = 2;
    int256 public constant INITIAL_ANSWER = 2000;
    string public constant CID =
        "QmQp9iagQS9uEQPV7hg5YGwWmCXxAs2ApyBCkpcu9ZAK6k";

    InputBox inputBox;
    EtherPortal etherPortal;
    TribesFactory tribesFactory;
    MockV3Aggregator parityRouter;

    function setUp() public {
        parityRouter = new MockV3Aggregator(DECIMALS, INITIAL_ANSWER);
        inputBox = new InputBox();
        etherPortal = new EtherPortal(inputBox);
        vm.prank(platform);
        tribesFactory = new TribesFactory(
            address(inputBox),
            address(etherPortal),
            address(parityRouter)
        );
    }

    function testSetCartesiDapp() public {
        vm.prank(platform);
        bool success = tribesFactory.setCartesiDapp(address(cartesiDappTest));
        (, , address _cartesiDapp, ) = tribesFactory.tribesFactoryData();
        assertTrue(success);
        assertTrue(_cartesiDapp == address(cartesiDappTest));
    }

    function testCreateTribe() public {
        vm.prank(creator);
        (address tribe, address supporters) = tribesFactory.createTribe(
            CID,
            address(etherPortal),
            address(parityRouter),
            address(inputBox),
            abi.encodePacked(msg.sig, abi.encode(creator))
        );
        assertTrue(tribe != address(0));
        assertTrue(supporters != address(0));
    }
}
