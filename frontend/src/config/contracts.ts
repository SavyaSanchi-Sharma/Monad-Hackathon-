// Contract addresses for localhost deployment
export const CONTRACT_ADDRESSES = {
  localhost: {
    CrushCredits: "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0",
    UserRegistry: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    Matchmaker: "0x9A676e781A523b5d0C0e43731313A708CB607508",
    ProfileMatcher: "0x0B306BF915C4d645ff596e518fAf3F9669b97016"
  },
  monad_testnet: {
    CrushCredits: "",
    UserRegistry: "",
    Matchmaker: "",
    ProfileMatcher: ""
  }
};

// Network configurations
export const NETWORKS = {
  localhost: {
    chainId: 1337,
    name: "Localhost",
    rpcUrl: "http://127.0.0.1:8545",
    currency: "ETH",
    explorer: "http://localhost:8545"
  },
  monad_testnet: {
    chainId: 10135,
    name: "Monad Testnet",
    rpcUrl: "https://testnet-rpc.monad.xyz",
    currency: "MONAD",
    explorer: "https://explorer.testnet.monad.xyz"
  }
};

// Get current network addresses
export function getContractAddresses(network: string) {
  return CONTRACT_ADDRESSES[network as keyof typeof CONTRACT_ADDRESSES] || CONTRACT_ADDRESSES.localhost;
}

// Get current network config
export function getNetworkConfig(network: string) {
  return NETWORKS[network as keyof typeof NETWORKS] || NETWORKS.localhost;
}

// Add Monad testnet to MetaMask
export async function addMonadTestnet() {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: '0x2797', // 10135 in hex
        chainName: 'Monad Testnet',
        nativeCurrency: {
          name: 'MONAD',
          symbol: 'MONAD',
          decimals: 18
        },
        rpcUrls: ['https://testnet-rpc.monad.xyz'],
        blockExplorerUrls: ['https://explorer.testnet.monad.xyz']
      }]
    });
    
    return true;
  } catch (error) {
    console.error('Failed to add Monad Testnet:', error);
    throw error;
  }
}
