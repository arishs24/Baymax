// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientAccess {
    struct AccessLevel {
        string mode; // e.g., child, adult, doctor
        address owner;
    }

    mapping(address => AccessLevel) private accessLevels;

    function setAccess(address user, string memory mode) public {
        require(msg.sender == owner, "Not authorized");
        accessLevels[user] = AccessLevel(mode, msg.sender);
    }

    function getAccess(address user) public view returns (string memory) {
        return accessLevels[user].mode;
    }
}
