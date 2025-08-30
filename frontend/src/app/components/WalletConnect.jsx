import { useState } from "react";

export default function WalletConnect() {
  const [account, setAccount] = useState(null);

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("MetaMask not detected!");
    }
  }

  return (
    <button
      onClick={connectWallet}
      className="bg-white text-purple-600 px-4 py-2 rounded-xl shadow hover:bg-purple-100 transition"
    >
      {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
    </button>
  );
}
