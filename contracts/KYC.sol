// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract KYC {
    struct User {
        string name;
        string email;
        string idNumber; // For simplicity, let's use a single ID number
        bool verified;
    }

    mapping(address => User) public users;
    address public admin;

    event UserRegistered(address indexed user);
    event UserVerified(address indexed user);

    constructor() {
        admin = msg.sender; // Set the deployer as the admin
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    function registerUser(string memory _name, string memory _email, string memory _idNumber) public {
        // Prevent overwriting existing user data
        require(bytes(users[msg.sender].name).length == 0, "User already registered");
        
        // Register the user
        users[msg.sender] = User(_name, _email, _idNumber, false);
        
        // Emit event for registration
        emit UserRegistered(msg.sender);
    }

    function verifyUser(address _user) public onlyAdmin {
        // Check if user exists
        require(bytes(users[_user].name).length > 0, "User not found");
        
        // Verify the user
        users[_user].verified = true;
        
        // Emit event for verification
        emit UserVerified(_user);
    }

    function getUser(address _user) public view returns (string memory, string memory, string memory, bool) {
        User memory user = users[_user];
        return (user.name, user.email, user.idNumber, user.verified);
    }
}
