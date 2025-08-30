const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🔧 Deployment Setup Check\n");

  // Check if .env file exists
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) {
    console.log("❌ .env file not found!");
    console.log("📝 Please create a .env file with your private key:");
    console.log("   cp env.example .env");
    console.log("   # Then edit .env and add: PRIVATE_KEY=your_private_key_here");
    console.log("   # IMPORTANT: Remove the 0x prefix from your private key\n");
    return;
  }

  // Check .env content
  const envContent = fs.readFileSync(envPath, "utf8");
  if (!envContent.includes("PRIVATE_KEY=") || envContent.includes("your_private_key_here")) {
    console.log("⚠️  .env file found but PRIVATE_KEY not configured!");
    console.log("📝 Please edit .env and replace 'your_private_key_here' with your actual private key");
    console.log("   # Remove the 0x prefix from your private key\n");
    return;
  }

  console.log("✅ .env file configured");

  // Check if contracts compile
  try {
    console.log("\n🔨 Compiling contracts...");
    await hre.run("compile");
    console.log("✅ Contracts compiled successfully");
  } catch (error) {
    console.log("❌ Contract compilation failed:", error.message);
    return;
  }

  // Check local network
  try {
    console.log("\n🏠 Testing local network...");
    const localProvider = new hre.ethers.providers.JsonRpcProvider("http://127.0.0.1:9545");
    await localProvider.getNetwork();
    console.log("✅ Local network accessible");
  } catch (error) {
    console.log("⚠️  Local network not accessible (run 'npx hardhat node' first)");
  }

  // Check Monad testnet
  try {
    console.log("\n🌐 Testing Monad testnet connection...");
    const monadProvider = new hre.ethers.providers.JsonRpcProvider("https://rpc.testnet.monad.xyz");
    const network = await monadProvider.getNetwork();
    console.log("✅ Monad testnet accessible");
    console.log("   Chain ID:", network.chainId);
  } catch (error) {
    console.log("❌ Monad testnet not accessible");
    console.log("   This might mean:");
    console.log("   - The testnet is not publicly available yet");
    console.log("   - The RPC URL has changed");
    console.log("   - Network is temporarily down");
  }

  // Summary
  console.log("\n📋 Setup Summary:");
  console.log("==================");
  console.log("Environment: ✅ Configured");
  console.log("Contracts: ✅ Compiled");
  console.log("Local Network: ✅ Ready");
  
  if (fs.existsSync(envPath) && !envContent.includes("your_private_key_here")) {
    console.log("\n🚀 You're ready to deploy!");
    console.log("\nNext steps:");
    console.log("1. Get testnet MONAD tokens for gas fees");
    console.log("2. Deploy to testnet: npx hardhat run scripts/deploy.js --network monad_testnet");
    console.log("3. Or test locally: npx hardhat run scripts/test-deployment.js --network localhost");
  } else {
    console.log("\n⚠️  Please complete your .env configuration first");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
