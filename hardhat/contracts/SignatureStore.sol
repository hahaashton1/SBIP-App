// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract SignatureStore is Initializable {

    mapping (address => string) private signatures;

    function initialize() public initializer {}

    // Setter method
    function storeSignature(string memory signature) public {
        require(msg.sender == tx.origin, "Only EOA can call this function");
        require(bytes(signature).length > 0, "Signature cannot be empty");
        signatures[msg.sender] = signature;
    }

    // Getter method
    function getSignature(address user) external view returns (string memory) {
        return signatures[user];
    }
}