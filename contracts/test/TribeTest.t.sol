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
    int256 public constant INITIAL_ANSWER = 2000;
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
        tribe = new Tribe(
            CID,
            cartesiDappTest,
            address(etherPortal),
            address(supporters),
            address(parityRouter)
        );
    }


    // function testMintDuringPreSale() public payable {
    //     hoax(user,  200);
    //     skip(1 days);
    //     bool success = tribe.mint{value: 200}(1);
    //     console.log(block.timestamp);
    //     assertTrue(success);
    // }

    function testClaimAffiliation() public {
        vm.prank(affiliate);
        bool success = supporters.claimAffiliation();
        assertTrue(success);
    }
}
