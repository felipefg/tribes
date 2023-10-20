// SPDX-License-Identifier: MIT

pragma solidity 0.8.20;

/**
 * @title TribeData
 * @dev TribeData struct store tribeData data
 */
struct TribeData {
    string cid;
    string name;
    address creator;
    address supporters;
    address etherPortal;
    address cartesiDapp;
    address parityRouter;
}