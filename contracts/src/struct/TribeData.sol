// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

/**
 * @title TribeData
 * @dev TribeData struct store tribeData data
 */
struct TribeData {
    string name;
    uint256 price;
    address creator;
    address cartesiDapp;
    address parityRouter;
    address etherPortal;
}