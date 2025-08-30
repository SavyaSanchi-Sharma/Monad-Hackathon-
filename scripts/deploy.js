const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  try {
    // Deploy CrushCredits first
    console.log("\n1. Deploying CrushCredits...");
    const CrushCredits = await hre.ethers.getContractFactory("CrushCredits");
    const crush = await CrushCredits.deploy(deployer.address);
    await crush.deployed();
    console.log("✅ CrushCredits deployed to:", crush.address);

    // Deploy UserRegistry
    console.log("\n2. Deploying UserRegistry...");
    const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
    const registry = await UserRegistry.deploy(deployer.address);
    await registry.deployed();
    console.log("✅ UserRegistry deployed to:", registry.address);

    // Deploy Matchmaker
    console.log("\n3. Deploying Matchmaker...");
    const Matchmaker = await hre.ethers.getContractFactory("Matchmaker");
    const matchmaker = await Matchmaker.deploy(deployer.address);
    await matchmaker.deployed();
    console.log("✅ Matchmaker deployed to:", matchmaker.address);

    // Deploy ProfileMatcher (depends on UserRegistry)
    console.log("\n4. Deploying ProfileMatcher...");
    const ProfileMatcher = await hre.ethers.getContractFactory("ProfileMatcher");
    const profileMatcher = await ProfileMatcher.deploy(registry.address, deployer.address);
    await profileMatcher.deployed();
    console.log("✅ ProfileMatcher deployed to:", profileMatcher.address);

    // Summary
    console.log("\n🎉 All contracts deployed successfully!");
    console.log("=====================================");
    console.log("CrushCredits:", crush.address);
    console.log("UserRegistry:", registry.address);
    console.log("Matchmaker:", matchmaker.address);
    console.log("ProfileMatcher:", profileMatcher.address);
    console.log("=====================================");

    // Verify contracts on Monad testnet explorer (if available)
    console.log("\n📝 To verify contracts on explorer:");
    console.log("Network: Monad Testnet");
    console.log("Chain ID: 1337");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
