const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const CrushCredits = await hre.ethers.getContractFactory("CrushCredits");
  const crush = await CrushCredits.deploy(deployer.address);
  await crush.deployed();
  console.log("CrushCredits deployed to:", crush.address);

  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
  const registry = await UserRegistry.deploy(deployer.address);
  await registry.deployed();
  console.log("UserRegistry deployed to:", registry.address);

  const Matchmaker = await hre.ethers.getContractFactory("Matchmaker");
  const matchmaker = await Matchmaker.deploy(deployer.address);
  await matchmaker.deployed();
  console.log("Matchmaker deployed to:", matchmaker.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
