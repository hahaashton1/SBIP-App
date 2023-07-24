// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract SignatureStore {

    mapping (address => string) private signatures;

    // Setter method
    function storeSignature(string memory signature) public {
        require(bytes(signature).length > 0, "Signature cannot be empty");
        signatures[msg.sender] = signature;
    }

    // Getter method
    function getSignature(address user) public view returns (string memory) {
        return signatures[user];
    }

    // TODO: Add in proxy to ensure contract upgradability

}