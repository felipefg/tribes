//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {Tribe} from "@contracts/nft/ERC1155/Tribe.sol";
import {MockV3Aggregator} from "@mock/MockV3Aggregator.sol";
import {InputBox} from "@cartesi/contracts/inputs/InputBox.sol";
import {Supporters} from "@contracts/nft/ERC1155/Supporters.sol";
import {EtherPortal} from "@cartesi/contracts/portals/EtherPortal.sol";

contract TribeTest is Test {
    address user = vm.addr(4);
    address supporter = vm.addr(1);
    address affiliate = vm.addr(3);
    address cartesiDappTest = vm.addr(2);
    uint8 public constant DECIMALS = 2;
    int256 public constant INITIAL_ANSWER = 3000;
    string public constant CID =
        "QmQp9iagQS9uEQPV7hg5YGwWmCXxAs2ApyBCkpcu9ZAK6k";

    Tribe tribe;
    InputBox inputBox;
    Supporters supporters;
    EtherPortal etherPortal;
    MockV3Aggregator parityRouter;

    function setUp() public {
        parityRouter = new MockV3Aggregator(DECIMALS, INITIAL_ANSWER);
        inputBox = new InputBox();
        etherPortal = new EtherPortal(inputBox);
        supporters = new Supporters(CID, address(inputBox), cartesiDappTest);

        vm.prank(affiliate);
        supporters.claimAffiliation();

        vm.prank(cartesiDappTest);
        supporters.mint(2, 1, affiliate);

        tribe = new Tribe(
            CID,
            cartesiDappTest,
            address(etherPortal),
            address(supporters),
            address(parityRouter)
        );

        vm.prank(cartesiDappTest);
        tribe.launchStrategy(
            block.timestamp + 1 days,
            block.timestamp + 2 days,
            2000,
            block.timestamp + 4 days,
            block.timestamp + 5 days,
            3000
        );
    }

    function testMintDuringSale() public payable {
        vm.warp(block.timestamp + 4 days + 3600);
        hoax(user, 1 ether);
        bool success = tribe.mint{value: 1 ether}(1);
        assertTrue(success);
    }

    function testMintWithAffiliateDuringSale() public payable {
        vm.warp(block.timestamp + 4 days + 3600);
        hoax(user, 1 ether);
        bool success = tribe.mintWithAffiliate{value: 1 ether}(1, affiliate);
        assertTrue(success);
    }

    function testUriEndUser() public {
        string memory uri = tribe.uri(0);

        // Convert the string to bytes before comparison
        bytes memory uriBytes = bytes(uri);
        bytes memory expectedBytes = bytes(
            "https://ipfs.io/ipfs/QmQp9iagQS9uEQPV7hg5YGwWmCXxAs2ApyBCkpcu9ZAK6k/0.json"
        );

        assertEq(uriBytes.length, expectedBytes.length);
        assertTrue(
            keccak256(abi.encodePacked(uriBytes)) ==
                keccak256(abi.encodePacked(expectedBytes))
        );
    }
}
