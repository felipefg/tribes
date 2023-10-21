//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {InputBox} from "@cartesi/contracts/inputs/InputBox.sol";
import {Supporters} from "@contracts/nft/ERC1155/Supporters.sol";

contract SupportersTest is Test {
    address affiliate = vm.addr(3);
    address supporter = vm.addr(1);
    address cartesiDappTest = vm.addr(2);
    string public constant CID =
        "QmQp9iagQS9uEQPV7hg5YGwWmCXxAs2ApyBCkpcu9ZAK6k";

    InputBox inputBox;
    Supporters supporters;

    function setUp() public {
        inputBox = new InputBox();
        supporters = new Supporters(CID, address(inputBox), cartesiDappTest);
    }

    function testMintFinancialSupporter() public {
        vm.prank(cartesiDappTest);
        bool success = supporters.mint(1, 4, supporter);
        assertTrue(success);
        assertEq(supporters.balanceOf(supporter, 1), 4);
    }

    function testMintAffiliate() public {
        vm.prank(cartesiDappTest);
        bool success = supporters.mint(2, 1, supporter);
        assertTrue(success);
        assertEq(supporters.balanceOf(supporter, 2), 1);
    }

    function testClaimAffiliation() public {
        vm.prank(affiliate);
        bool success = supporters.claimAffiliation();
        assertTrue(success);
    }

    function testUriFinancialSupporter() public {
        string memory uri = supporters.uri(1);

        // Convert the string to bytes before comparison
        bytes memory uriBytes = bytes(uri);
        bytes memory expectedBytes = bytes(
            "https://ipfs.io/ipfs/QmQp9iagQS9uEQPV7hg5YGwWmCXxAs2ApyBCkpcu9ZAK6k/1.json"
        );

        assertEq(uriBytes.length, expectedBytes.length);
        assertTrue(
            keccak256(abi.encodePacked(uriBytes)) ==
                keccak256(abi.encodePacked(expectedBytes))
        );
    }

    function testUriAffiliate() public {
        string memory uri = supporters.uri(2);

        // Convert the string to bytes before comparison
        bytes memory uriBytes = bytes(uri);
        bytes memory expectedBytes = bytes(
            "https://ipfs.io/ipfs/QmQp9iagQS9uEQPV7hg5YGwWmCXxAs2ApyBCkpcu9ZAK6k/2.json"
        );

        assertEq(uriBytes.length, expectedBytes.length);
        assertTrue(
            keccak256(abi.encodePacked(uriBytes)) ==
                keccak256(abi.encodePacked(expectedBytes))
        );
    }
}
