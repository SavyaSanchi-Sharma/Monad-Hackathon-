// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

contract UserRegistry is Ownable {
    struct User {
        uint256 age;
        string gender;
        string tags;
        bool registered;
    }

    mapping(address => User) public users;

    constructor(address initialOwner) Ownable(initialOwner) {}

    function register(uint256 age, string memory gender, string memory tags) external {
        users[msg.sender] = User(age, gender, tags, true);
    }
}
