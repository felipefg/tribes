// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Tribe} from "@contracts/nft/ERC1155/Tribe.sol";
import {TribesFactoryData} from "@struct/TribesFactoryData.sol";
import {Supporters} from "@contracts/nft/ERC1155/Supporters.sol";
import {IInputBox} from "@cartesi/contracts/inputs/IInputBox.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract TribesFactory is AccessControl {
    TribesFactoryData public tribesFactoryData;

    event TribeCreated(
        address indexed sender,
        address indexed tribe,
        address indexed supporters
    );

    error TribeFactoryFailed(address sender);

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    constructor(
        address _inputBox,
        address _etherPortal,
        address _parityRouter
    ) {
        tribesFactoryData.inputBox = _inputBox;
        tribesFactoryData.etherPortal = _etherPortal;
        tribesFactoryData.parityRouter = _parityRouter;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
    }

    function setCartesiDapp(address _cartesiDapp) public onlyRole(MANAGER_ROLE) returns (bool) {
        tribesFactoryData.cartesiDapp = _cartesiDapp;
        return true;
    }

    function createTribe(
        string memory cid,
        address etherPortal,
        address parityRouter,
        address inputBox,
        bytes memory input
    ) public returns (address tribe, address supporters) {
        supporters = address(
            new Supporters(cid, inputBox, tribesFactoryData.cartesiDapp)
        );
        tribe = address(
            new Tribe(
                cid,
                tribesFactoryData.cartesiDapp,
                etherPortal,
                supporters,
                parityRouter
            )
        );
        bytes memory _input = abi.encodePacked(
            msg.sig,
            msg.sender,
            tribe,
            supporters,
            input
        );
        IInputBox(tribesFactoryData.inputBox).addInput(
            tribesFactoryData.cartesiDapp,
            _input
        );
        emit TribeCreated(msg.sender, tribe, supporters);
        return (tribe, supporters);
    }
}
