// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SupportersData} from "@struct/SupportersData.sol";
import {IInputBox} from "@cartesi/contracts/inputs/IInputBox.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";


/**
 * @title Supporters Contract
 * @dev The Supporters contract is an ERC1155 contract that manage roles and mint tokens for Financial Supporters and Affiliates.
 */
contract Supporters is ERC1155, AccessControl, ERC1155Burnable, ERC1155Supply {
    SupportersData public supportersData;

    bytes32 public constant CARTESI_DAPP = keccak256("CARTESI_DAPP");

    event Affiliation(address indexed account);
    event Mint(address indexed account, uint256 indexed id);

    constructor(
        string memory cid,
        address _inputBox,
        address _cartesiDapp
    ) ERC1155("") {
        supportersData.cid = cid;
        supportersData.inputBox = _inputBox;
        supportersData.cartesiDapp = _cartesiDapp;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CARTESI_DAPP, _cartesiDapp);
    }

    /**
     * @notice Mint a new token for Financial Supporters or Affiliates
     * @param id The id of the token to mint
     * @param amount The amount of tokens to mint
     * @param account The address to mint the tokens to
     * @return true if the operation was successful
     * @dev This function mints a new token for Financial Supporters or Affiliates and only can be called by the Cartesi DApp
     */
    function mint(
        uint256 id,
        uint256 amount,
        address account
    ) external onlyRole(CARTESI_DAPP) returns (bool) {
        bytes memory data = abi.encodePacked(id);
        _mint(account, id, amount, data);
        emit Mint(account, id);
        return true;
    }

    /**
     * @notice Claim affiliation
     * @return true if the operation was successful
     * @dev This function claims affiliation and can be called by any address interested in the project. It sends the function signature and address of the caller to the InputBox.
     */
    function claimAffiliation() public returns (bool) {
        bytes memory _input = abi.encodePacked(msg.sig, msg.sender);
        IInputBox(supportersData.inputBox).addInput(
            supportersData.cartesiDapp,
            _input
        );
        emit Affiliation(msg.sender);
        return true;
    }

    /**
     * @notice Get the URI of a token
     * @param id The id of the token
     * @return The URI of the token
     * @dev This function returns the URI of a token and can be called by any address
     */
    function uri(uint256 id) public view override returns (string memory) {
        return
            string.concat(
                "https://ipfs.io/ipfs/",
                supportersData.cid,
                "/",
                Strings.toString(id),
                ".json"
            );
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
