// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SignatureStore  {

    mapping (address => string) private signatures;

    // Setter method
    function storeSignature(string memory signature) external {
        require(msg.sender == tx.origin, "Only EOA can call this function");
        require(bytes(signature).length > 0, "Signature cannot be empty");
        signatures[msg.sender] = signature;
    }

    // Getter method
    function getSignature(address user) external view returns (string memory) {
        return signatures[user];
    }
}