// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SignatureStore  {

    mapping (address => string) private hashes;

    // Setter method
    function storeHash(string memory hash) external {
        require(msg.sender == tx.origin, "Only EOA can call this function");
        require(bytes(hash).length > 0, "Signature cannot be empty");

        hashes[msg.sender] = hash;
    }

    // Getter method
    function getHash(address user) external view returns (string memory) {
        return hashes[user];
    }
}