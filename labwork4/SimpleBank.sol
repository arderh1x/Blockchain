// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract SimpleBank {
    address public owner;
    mapping (address => uint256) public balances;
    mapping (address => bool) public registered;
    uint256 public totalBankBalance;

    address[] private userAddresses;
    struct User {
        address userAddress;
        uint256 balance;
    }

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    modifier isRegistered() {
        require(registered[msg.sender], "Only registered users can call this function.");
        _;
    }

    function register() public {
        if(!registered[msg.sender]) {
            userAddresses.push(msg.sender);
        }
        registered[msg.sender] = true;
    }

    function deposit() public isRegistered payable {
        balances[msg.sender] += msg.value;
        totalBankBalance += msg.value;
    }

    function getMyBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function withdraw(uint256 _amount) public isRegistered {
        // will use modifier for registered check, not require (as it still uses in modifier)
        require(balances[msg.sender] >= _amount, "Not enough on balance.");
        balances[msg.sender] -= _amount;
        totalBankBalance -= _amount;
        payable(msg.sender).transfer(_amount);
    }

    function transfer(address _to, uint256 _amount) public isRegistered {
        require(registered[_to], "You can transfer only to registered user.");
        require(balances[msg.sender] >= _amount, "Not enough on balance.");
        balances[msg.sender] -= _amount;
        balances[_to] += _amount;
    }

    function getTotalBankBalance() public view onlyOwner returns (uint256) {
        return totalBankBalance;
    }

    function getAllUsersBalance() public view returns ( User[] memory UsersBalances) {
        for(uint256 i = 0; i < userAddresses.length; i++) {
            UsersBalances[i] = User(userAddresses[i], balances[userAddresses[i]]);
        }
    }    
}