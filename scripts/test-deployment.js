const hre = require("hardhat");

async function main() {
  console.log("🧪 Testing contract deployment and basic functionality...\n");

  const [deployer, user1, user2] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("User1:", user1.address);
  console.log("User2:", user2.address);
  console.log("Deployer balance:", hre.ethers.utils.formatEther(await deployer.getBalance()), "ETH\n");

  try {
    // Deploy contracts
    console.log("1. Deploying contracts...");
    
    const CrushCredits = await hre.ethers.getContractFactory("CrushCredits");
    const crush = await CrushCredits.deploy(deployer.address);
    await crush.deployed();
    console.log("✅ CrushCredits deployed to:", crush.address);

    const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
    const registry = await UserRegistry.deploy(deployer.address);
    await registry.deployed();
    console.log("✅ UserRegistry deployed to:", registry.address);

    const Matchmaker = await hre.ethers.getContractFactory("Matchmaker");
    const matchmaker = await Matchmaker.deploy(deployer.address);
    await matchmaker.deployed();
    console.log("✅ Matchmaker deployed to:", matchmaker.address);

    const ProfileMatcher = await hre.ethers.getContractFactory("ProfileMatcher");
    const profileMatcher = await ProfileMatcher.deploy(registry.address, deployer.address);
    await profileMatcher.deployed();
    console.log("✅ ProfileMatcher deployed to:", profileMatcher.address);

    // Test basic functionality
    console.log("\n2. Testing basic functionality...");
    
    // Check CRUSH token balance
    const deployerBalance = await crush.balanceOf(deployer.address);
    console.log("✅ Deployer CRUSH balance:", hre.ethers.utils.formatEther(deployerBalance));

    // Test user registration
    console.log("\n3. Testing user registration...");
    await registry.connect(user1).register(25, "Female", "music,travel,tech");
    await registry.connect(user2).register(28, "Male", "sports,gaming,music");
    console.log("✅ Users registered successfully");

    // Test ProfileMatcher
    console.log("\n4. Testing ProfileMatcher...");
    await profileMatcher.recordMatch(user1.address, user2.address, 85);
    console.log("✅ Match recorded successfully");

    // Get match result
    const matchResult = await profileMatcher.matches(user1.address, user2.address);
    console.log("✅ Match score:", matchResult.score.toString());

    console.log("\n🎉 All tests passed! Contracts are ready for deployment.");
    console.log("\n📋 Contract Addresses:");
    console.log("CrushCredits:", crush.address);
    console.log("UserRegistry:", registry.address);
    console.log("Matchmaker:", matchmaker.address);
    console.log("ProfileMatcher:", profileMatcher.address);

  } catch (error) {
    console.error("❌ Test failed:", error);
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
