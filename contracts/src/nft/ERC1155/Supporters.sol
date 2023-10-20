// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SupportersData} from "@struct/SupportersData.sol";
import {IInputBox} from "@cartesi/contracts/inputs/IInputBox.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

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

    function mint(
        uint256 id,
        uint256 amount,
        address account
    ) public onlyRole(CARTESI_DAPP) returns (bool) {
        bytes memory data = abi.encodePacked(id);
        _mint(account, id, amount, data);
        emit Mint(account, id);
        return true;
    }

    function claimAffiliation() public returns (bool) {
        bytes memory _input = abi.encodePacked(msg.sig, msg.sender);
        IInputBox(supportersData.inputBox).addInput(
            supportersData.cartesiDapp,
            _input
        );
        emit Affiliation(msg.sender);
        return true;
    }

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
