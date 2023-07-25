import { ethers, upgrades } from "hardhat";

async function upgrade() {

    // Make sure to change this if you ever deploy a new contract
    const proxyAddress = "...";

    const _signatureStore = await ethers.getContractFactory("SignatureStore");
    const signatureStore =  await upgrades.upgradeProxy(proxyAddress, _signatureStore);
    console.log(signatureStore);
    console.log("Contract upgraded");

    const implementationAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("Implementation deployed to:", implementationAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
upgrade().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  