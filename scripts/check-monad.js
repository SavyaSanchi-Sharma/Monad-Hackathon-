const hre = require("hardhat");

async function main() {
  console.log("🔍 Checking Monad testnet connection...\n");

  try {
    // Get network info
    const network = await hre.ethers.provider.getNetwork();
    console.log("Network Details:");
    console.log("Chain ID:", network.chainId);
    console.log("Name:", network.name);
    
    // Get latest block
    const latestBlock = await hre.ethers.provider.getBlockNumber();
    console.log("Latest Block:", latestBlock);
    
    // Get gas price
    const gasPrice = await hre.ethers.provider.getGasPrice();
    console.log("Gas Price:", hre.ethers.utils.formatUnits(gasPrice, "gwei"), "gwei");
    
    // Check if we have a signer
    const [signer] = await hre.ethers.getSigners();
    if (signer) {
      console.log("\nSigner Details:");
      console.log("Address:", signer.address);
      const balance = await signer.getBalance();
      console.log("Balance:", hre.ethers.utils.formatEther(balance), "MONAD");
      
      if (balance.isZero()) {
        console.log("\n⚠️  Warning: Your account has 0 MONAD balance!");
        console.log("You'll need testnet MONAD tokens to deploy contracts.");
        console.log("Check the Monad testnet faucet for test tokens.");
      } else {
        console.log("\n✅ Sufficient balance for deployment!");
      }
    } else {
      console.log("❌ No signer found. Check your .env file for PRIVATE_KEY");
    }
    
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    if (error.message.includes("network")) {
      console.log("\n💡 This might mean:");
      console.log("1. The RPC URL is incorrect");
      console.log("2. The network is down");
      console.log("3. There's a network configuration issue");
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
