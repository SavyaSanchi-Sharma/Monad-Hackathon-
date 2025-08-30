// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./UserRegistry.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProfileMatcher is Ownable {
    UserRegistry public userRegistry;
    
    struct MatchResult {
        address user1;
        address user2;
        uint256 score;
        uint256 timestamp;
    }
    
    mapping(address => mapping(address => MatchResult)) public matches;
    
    event MatchCreated(address indexed user1, address indexed user2, uint256 score);
    
    constructor(address _userRegistry, address initialOwner) Ownable(initialOwner) {
        userRegistry = UserRegistry(_userRegistry);
    }
    
    function recordMatch(address user1, address user2, uint256 score) external onlyOwner {
        require(userRegistry.users(user1).registered, "User1 not registered");
        require(userRegistry.users(user2).registered, "User2 not registered");
        
        matches[user1][user2] = MatchResult(user1, user2, score, block.timestamp);
        matches[user2][user1] = MatchResult(user2, user1, score, block.timestamp);
        
        emit MatchCreated(user1, user2, score);
    }
}