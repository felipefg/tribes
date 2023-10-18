// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SupportersData} from "@struct/SupportersData.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract Supporters is ERC1155, AccessControl, ERC1155Burnable, ERC1155Supply {
    SupportersData public supportersData;

    bytes32 public constant CARTESI_DAPP = keccak256("CARTESI_DAPP");

    event Mint(
        address indexed account,
        uint256 indexed id,
        uint256 amount,
        bytes data
    );

    constructor(
        string memory uri,
        string memory name,
        address _cartesiDapp
    ) ERC1155(uri) {
        supportersData.name = name;
        supportersData.cartesiDapp = _cartesiDapp;
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public payable onlyRole(CARTESI_DAPP) {
        _mint(account, id, amount, data);
        emit Mint(account, id, amount, data);
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
