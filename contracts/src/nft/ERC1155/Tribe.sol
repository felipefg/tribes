// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TribeData} from "@struct/TribeData.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/interfaces/AggregatorV3Interface.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC1155Pausable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract Tribe is
    ERC1155,
    ERC1155Pausable,
    AccessControl,
    ERC1155Burnable,
    ERC1155Supply
{
    TribeData public tribeData;

    bytes32 public constant COMMUNITY_MANAGER = keccak256("COMMUNITY_MANAGER");

    event Mint(
        address indexed account,
        uint256 indexed id,
        uint256 amount,
        bytes data
    );
    event Withdraw(address indexed account, uint256 amount);

    error WithdrawFailed(address account, uint256 amount);
    error MintFailed(address account, uint256 id, uint256 amount);

    constructor(
        string memory uri,
        string memory name,
        address parityRouter
    ) ERC1155(uri) {
        tribeData.name = name;
        tribeData.creator = msg.sender;
        tribeData.parityRouter = parityRouter;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMMUNITY_MANAGER, msg.sender);
    }

    function pause() public onlyRole(COMMUNITY_MANAGER) {
        _pause();
    }

    function unpause() public onlyRole(COMMUNITY_MANAGER) {
        _unpause();
    }

    function setPrice(uint256 price) public onlyRole(COMMUNITY_MANAGER) {
        tribeData.price = price;
    }

    function _quoteParity() private view returns (uint256) {
        (, int256 price, , , ) = AggregatorV3Interface(tribeData.parityRouter)
            .latestRoundData();
        return uint256(price / 1e8);
    }

    function mint(address account, uint256 id, uint256 amount) public payable {
        if ((msg.value / 1e8) * _quoteParity() < tribeData.price) {
            revert MintFailed(account, id, amount);
        } else {
            bytes memory data = abi.encodePacked(tribeData.name, id);
            _mint(account, id, amount, data);
            emit Mint(account, id, amount, data);
        }
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Pausable, ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function withdraw() external {
        (bool success, ) = payable(tribeData.creator).call{
            value: address(this).balance
        }("");
        if (!success) {
            revert WithdrawFailed(tribeData.creator, address(this).balance);
        } else {
            emit Withdraw(tribeData.creator, address(this).balance);
        }
    }
}
