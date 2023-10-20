// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

/**
 * @title LaunchStrategyData
 * @dev LaunchStrategyData struct store launch strategy data
 */
struct LaunchStrategyData {
    uint256 preSaleStartTime;
    uint256 preSaleEndTime;
    uint256 preSalePrice;
    uint256 saleStartTime;
    uint256 saleEndTime;
    uint256 salePrice;
}