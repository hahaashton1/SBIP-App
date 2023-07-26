import { ethers, upgrades } from "hardhat";

async function deploy() {

  const _signatureStore = await ethers.getContractFactory("SignatureStore");
  const SignatureStore = await _signatureStore.deploy();
  console.log("SignatureStore deployed to:", SignatureStore.address);

  // console.log("Deploying SignatureStore Proxy...");

  // const SignatureStore = await upgrades.deployProxy(_signatureStore);  
  // await SignatureStore.waitForDeployment();

  // const contract = await upgrades.deployProxy(_signatureStore, [], {
  //   initializer: "initialize",
  //   kind: "transparent",
  // });
  // await contract.deployed();

  // Leaving this as any for the time being
  // const implementationAddress = await upgrades.erc1967.getImplementationAddress(SignatureStore.address as any); 

  // console.log("Proxy deployed to:", SignatureStore.getAddress());
  // console.log("Implementation deployed to:", implementationAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
