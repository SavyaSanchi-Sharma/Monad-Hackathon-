require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.28", // for your Lock.sol
      },
      {
        version: "0.8.17", // fallback if some contracts use this
      }
    ]
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:9545",
    },
    monad_testnet: {
      url: "https://testnet-rpc.monad.xyz",
      chainId: 10143,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
};
