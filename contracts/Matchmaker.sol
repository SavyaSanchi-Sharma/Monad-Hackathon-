// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Matchmaker is Ownable {
    struct Match {
        uint256 score;
        string encryptedDecision;
    }

    mapping(address => mapping(address => Match)) public matches;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function setMatch(
        address user1,
        address user2,
        uint256 score,
        string memory encryptedDecision
    ) external onlyOwner {
        matches[user1][user2] = Match(score, encryptedDecision);
    }

    function getMatch(address user1, address user2) external view returns (uint256, string memory) {
        Match memory m = matches[user1][user2];
        return (m.score, m.encryptedDecision);
    }
}
