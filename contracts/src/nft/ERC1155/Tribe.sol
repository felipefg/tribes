// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {TribeData} from "@struct/TribeData.sol";
import {Supporters} from "@contracts/nft/ERC1155/Supporters.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {LaunchStrategyData} from "@struct/LaunchStrategyData.sol";
import {IEtherPortal} from "@cartesi/contracts/portals/IEtherPortal.sol";
import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/interfaces/AggregatorV3Interface.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {ERC1155Pausable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

/**
 * @title Tribe Contract
 * @dev The Tribe contract is an ERC1155 contract that represents a product after project design ang fundraising.
 */
contract Tribe is
    ERC1155,
    AccessControl,
    ERC1155Burnable,
    ERC1155Pausable,
    ERC1155Supply
{
    TribeData public tribeData;
    LaunchStrategyData public launchStrategyData;

    bytes32 public constant CARTESI_DAPP = keccak256("CARTESI_DAPP");

    event Mint(address indexed account, uint256 indexed id);
    event LaunchStrategy(
        uint256 preSaleStartTime,
        uint256 preSaleEndTime,
        uint256 preSalePrice,
        uint256 saleStartTime,
        uint256 saleEndTime,
        uint256 salePrice
    );

    error OutsideSaleWindow(uint256 timestamp);
    error MintFailed(address account, uint256 value);

    constructor(
        string memory cid,
        address cartesiDapp,
        address etherPortal,
        address supporters,
        address parityRouter
    ) ERC1155("") {
        tribeData.cid = cid;
        tribeData.supporters = supporters;
        tribeData.cartesiDapp = cartesiDapp;
        tribeData.etherPortal = etherPortal;
        tribeData.parityRouter = parityRouter;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(CARTESI_DAPP, cartesiDapp);
        _pause();
    }

    /**
     * @notice Define the launch strategy of the project
     * @param _preSaleStartTime The start time of the pre-sale
     * @param _preSaleEndTime The end time of the pre-sale
     * @param _preSalePrice The price of the pre-sale
     * @param _saleStartTime The start time of the sale
     * @param _saleEndTime The end time of the sale
     * @param _salePrice The price of the sale
     * @return true If the operation was successful
     * @dev This function defines the launch strategy of the project and only can be called by the Cartesi DApp
     */
    function launchStrategy(
        uint256 _preSaleStartTime,
        uint256 _preSaleEndTime,
        uint256 _preSalePrice,
        uint256 _saleStartTime,
        uint256 _saleEndTime,
        uint256 _salePrice
    ) external onlyRole(CARTESI_DAPP) returns (bool) {
        launchStrategyData.preSaleStartTime = _preSaleStartTime;
        launchStrategyData.preSaleEndTime = _preSaleEndTime;
        launchStrategyData.preSalePrice = _preSalePrice;
        launchStrategyData.saleStartTime = _saleStartTime;
        launchStrategyData.saleEndTime = _saleEndTime;
        launchStrategyData.salePrice = _salePrice;
        _unpause();
        emit LaunchStrategy(
            _preSaleStartTime,
            _preSaleEndTime,
            _preSalePrice,
            _saleStartTime,
            _saleEndTime,
            _salePrice
        );
        return true;
    }

    /**
     * @notice Get the price of the product in the current timestamp according to the launch strategy
     * @return The price of the token
     * @dev This function returns the price of the token using the launch strategy and the current timestamp and only can be called inside of the contract
     */
    function _getPrice() private view returns (uint256) {
        if (
            block.timestamp >= launchStrategyData.preSaleStartTime &&
            block.timestamp <= launchStrategyData.preSaleEndTime
        ) {
            return launchStrategyData.preSalePrice;
        } else if (
            block.timestamp >= launchStrategyData.saleStartTime &&
            block.timestamp <= launchStrategyData.saleEndTime
        ) {
            return launchStrategyData.salePrice;
        } else {
            revert OutsideSaleWindow(block.timestamp);
        }
    }

    /**
     * @notice Check if an address has affiliation
     * @param affiliate The address of the affiliate
     * @return true if the address has affiliation
     * @dev This function checks if an address has affiliation and can be called only inside the contract
     */
    function _hasAffiliation(address affiliate) private view returns (bool) {
        return Supporters(tribeData.supporters).balanceOf(affiliate, 2) > 0;
    }

    /**
     * @notice Chainlink price feed implementation
     * @return The price of the token
     * @dev This function returns the price of the token without decimals and can be called by any address
     */
    function _quoteParity() private view returns (uint256) {
        (, int256 price, , , ) = AggregatorV3Interface(tribeData.parityRouter)
            .latestRoundData();
        return uint256(price / 1e8);
    }

    /**
     * @notice Mint a new token for end users
     * @param amount The amount of tokens to mint
     * @return true if the operation was successful
     * @dev This payable function mints a new token for end users and can be called by any address interested in the project. It sends the value of the transaction, function signature, caller address to Cartesi DApp via EtherPortal.
     */
    function mint(uint256 amount) public payable returns (bool) {
        if ((msg.value / 1e8) * _quoteParity() == _getPrice() * amount) {
            revert MintFailed(msg.sender, msg.value);
        } else {
            uint256 id = 0;
            bytes memory data = abi.encodePacked(id);
            bytes memory _executeLayerData = abi.encodePacked(
                msg.sig,
                msg.sender
            );
            IEtherPortal(tribeData.etherPortal).depositEther{value: msg.value}(
                tribeData.cartesiDapp,
                _executeLayerData
            );
            _mint(msg.sender, id, amount, data);
            emit Mint(msg.sender, id);
            return true;
        }
    }

    /**
     * @notice Mint a new token for end users
     * @param amount The amount of tokens to mint
     * @param affiliate The address of the affiliate
     * @return true if the operation was successful
     * @dev This payable function mints a new token for end users and can be called by any address interested in the project. It sends the value of the transaction, function signature, caller address and affiliate address to Cartesi DApp via EtherPortal.
     */
    function mintWithAffiliate(
        uint256 amount,
        address affiliate
    ) public payable returns (bool) {
        if (
            (msg.value / 1e8) * _quoteParity() < _getPrice() * amount &&
            !_hasAffiliation(affiliate)
        ) {
            revert MintFailed(msg.sender, msg.value);
        } else {
            uint256 id = 0;
            bytes memory data = abi.encodePacked(id, affiliate);
            bytes memory _executeLayerData = abi.encodePacked(
                msg.sig,
                affiliate,
                msg.sender
            );
            IEtherPortal(tribeData.etherPortal).depositEther{value: msg.value}(
                tribeData.cartesiDapp,
                _executeLayerData
            );
            _mint(msg.sender, id, amount, data);
            emit Mint(msg.sender, id);
            return true;
        }
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
                tribeData.cid,
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
    ) internal override(ERC1155, ERC1155Pausable, ERC1155Supply) {
        super._update(from, to, ids, values);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
