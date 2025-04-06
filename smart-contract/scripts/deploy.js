const hre = require("hardhat");

async function main() {
  // Use the correct contract name "ProfileImageNfts"
  const profileImageNftsFactory = await hre.ethers.getContractFactory(
    "ProfileImageNfts"
  );

  // Deploy the contract
  const profileImageContract = await profileImageNftsFactory.deploy();

  // Wait for the contract to be deployed
  await profileImageContract.waitForDeployment();

  // Get the contract address
  const contractAddress = await profileImageContract.getAddress();

  console.log("Profile Image NFT contract deployed to:", contractAddress);
}

async function runMain() {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();
