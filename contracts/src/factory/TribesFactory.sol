// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Tribe} from "@contracts/nft/ERC1155/Tribe.sol";
import {TribesFactoryData} from "@struct/TribesFactoryData.sol";
import {Supporters} from "@contracts/nft/ERC1155/Supporters.sol";
import {IInputBox} from "@cartesi/contracts/inputs/IInputBox.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";


/**
 * @title Tribes Factory Contract
 * @dev The TribesFactory contract, an AccessControl contract, creates Tribe and Supporters contracts, sending project information to the Cartesi DApp via InputBox.
 */
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

    /**
     * @notice Set the Cartesi DApp address
     * @param _cartesiDapp  Address of the Cartesi DApp
     * @return true If the operation was successful
     * @dev This function sets the Cartesi DApp address and only can be called by the Manager
     */
    function setCartesiDapp(
        address _cartesiDapp
    ) public onlyRole(MANAGER_ROLE) returns (bool) {
        tribesFactoryData.cartesiDapp = _cartesiDapp;
        return true;
    }

    /**
     * @notice Creates a new Tribe with associated Supporters contract.
     * @param cid Content ID of the project.
     * @param etherPortal Address of the EtherPortal.
     * @param parityRouter Address of the ParityRouter.
     * @param inputBox Address of the InputBox.
     * @param input Additional input data.
     * @return tribe The address of the created Tribe contract.
     * @return supporters The address of the associated Supporters contract.
     * @dev This function initializes a Tribe and its associated Supporters contract, and adds relevant information to the InputBox and can be called by any creator. Its sends project information to the Cartesi DApp via InputBox.
     */
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
