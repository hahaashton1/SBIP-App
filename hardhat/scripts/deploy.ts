import { ethers, upgrades } from "hardhat";

async function deploy() {

  const signatureStore = await ethers.getContractFactory("SignatureStore");
  console.log("Deploying SignatureStore contract...");
  const contract = await upgrades.deployProxy(signatureStore, [], {
    initializer: "initialize",
    kind: "transparent",
  });
  await contract.deployed();
  // Leaving this as any for the time being
  const implementationAddress = await upgrades.erc1967.getImplementationAddress(contract.address as any); 
  console.log("Proxy deployed to:", contract.address);
  console.log("Implementation deployed to:", implementationAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
