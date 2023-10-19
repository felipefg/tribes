// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TribeData} from "@struct/TribeData.sol";
import {Counter} from "@chainlink/contracts/tests/Counter.sol";
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
    ERC1155Supply,
    Counter
{
    TribeData public tribeData;

    bytes32 public constant CREATOR = keccak256("CREATOR");

    event Mint(address indexed account, uint256 indexed value, uint256 indexed id);

    error MintFailed(address account, uint256 value);

    constructor(
        address creator,
        string memory uri,
        string memory name,
        address etherPortal,
        address parityRouter
    ) ERC1155(uri) {
        tribeData.name = name;
        tribeData.creator = creator;
        tribeData.etherPortal = etherPortal;
        tribeData.parityRouter = parityRouter;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CREATOR, creator);
        pause();
    }

    function pause() public onlyRole(CREATOR) {
        _pause();
    }

    function unpause() public onlyRole(CREATOR) {
        _unpause();
    }

    function setPrice(uint256 price) public onlyRole(CREATOR) {
        tribeData.price = price;
    }

    function _quoteParity() private view returns (uint256) {
        (, int256 price, , , ) = AggregatorV3Interface(tribeData.parityRouter)
            .latestRoundData();
        return uint256(price / 1e8);
    }

    function mint(uint256 amount) public payable returns (bool) {
        if ((msg.value / 1e8) * _quoteParity() < tribeData.price) {
            revert MintFailed(msg.sender, msg.value);
        } else {
            uint256 id = increment();
            bytes memory data = abi.encodePacked(id);
            bytes memory _executeLayerData = abi.encodePacked(
                msg.sig,
                msg.sender
            );
            (bool success, ) = address(tribeData.etherPortal).call{
                value: msg.value
            }(
                abi.encodeWithSignature(
                    "depositEther(address,bytes)",
                    tribeData.cartesiDapp,
                    _executeLayerData
                )
            );
            if (!success) {
                revert MintFailed(msg.sender, msg.value);
            } else {
                _mint(msg.sender, id, amount, data);
                emit Mint(msg.sender, msg.value, id);
                return true;
            }
        }
    }

    function mintWithVoucher(
        uint256 amount,
        string memory voucher
    ) public payable returns (bool) {
        if ((msg.value / 1e8) * _quoteParity() < tribeData.price) {
            revert MintFailed(msg.sender, msg.value);
        } else {
            uint256 id = increment();
            bytes memory data = abi.encodePacked(id, voucher);
            bytes memory _executeLayerData = abi.encodePacked(
                msg.sig,
                voucher,
                msg.sender
            );
            (bool success, ) = address(tribeData.etherPortal).call{
                value: msg.value
            }(
                abi.encodeWithSignature(
                    "depositEther(address,bytes)",
                    tribeData.cartesiDapp,
                    _executeLayerData
                )
            );
            if (!success) {
                revert MintFailed(msg.sender, msg.value);
            } else {
                _mint(msg.sender, id, amount, data);
                emit Mint(msg.sender, msg.value, id);
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
    ) internal override(ERC1155, ERC1155Pausable, ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
