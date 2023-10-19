// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SupportersData} from "@struct/SupportersData.sol";
import {Counter} from "@chainlink/contracts/tests/Counter.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract Supporters is
    ERC1155,
    AccessControl,
    ERC1155Burnable,
    ERC1155Supply,
    Counter
{
    enum Affiliation {
        NOT_ACTIVE,
        ACTIVE
    }

    Affiliation public affiliation;
    SupportersData public supportersData;

    bytes32 public constant CREATOR = keccak256("CREATOR");
    bytes32 public constant CARTESI_DAPP = keccak256("CARTESI_DAPP");

    event Mint(address indexed account, uint256 indexed id);
    event RegisteredAffiliation(address indexed account, uint256 indexed id);

    error AffiliationFailed(address account);

    constructor(
        address creator,
        string memory uri,
        address _inputBox,
        string memory name,
        address _cartesiDapp
    ) ERC1155(uri) {
        supportersData.name = name;
        supportersData.creator = creator;
        supportersData.inputBox = _inputBox;
        supportersData.cartesiDapp = _cartesiDapp;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CREATOR, creator);
        _grantRole(CARTESI_DAPP, _cartesiDapp);
    }

    function financialSupporter(
        uint256 amount,
        address account,
        string memory role
    ) public payable onlyRole(CARTESI_DAPP) returns (bool) {
        uint256 id = increment();
        bytes memory data = abi.encodePacked(role, id);
        _mint(account, id, amount, data);
        emit Mint(account, id);
        return true;
    }

    function getAffiliationStatus() public view returns (Affiliation) {
        return affiliation;
    }

    function setAffiliation(Affiliation _status) public onlyRole(CREATOR) {
        affiliation = _status;
    }

    function affiliate(
        uint256 affiliationFee,
        string memory voucher,
        string memory role
    ) public returns (bool) {
        if (affiliation == Affiliation.NOT_ACTIVE) {
            revert AffiliationFailed(msg.sender);
        } else {
            uint256 id = increment();
            bytes memory _input = abi.encodePacked(affiliationFee, voucher);
            bytes memory data = abi.encodePacked(role, id);
            (bool success, ) = address(supportersData.inputBox).call(
                abi.encodeWithSignature(
                    "addInput(address,bytes)",
                    supportersData.cartesiDapp,
                    _input
                )
            );
            if (!success) {
                revert AffiliationFailed(msg.sender);
            } else {
                _mint(msg.sender, id, 1, data);
                emit RegisteredAffiliation(msg.sender, id);
                return true;
            }
        }
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
