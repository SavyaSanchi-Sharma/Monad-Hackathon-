import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { ethers } from 'ethers';
import UserRegistry from '../contracts/UserRegistry.json'; // we’ll copy ABI here later

export default function Home() {
  const [status, setStatus] = useState("");

  async function registerUser() {
    if (!window.ethereum) return alert("MetaMask not found!");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    // Replace with your deployed contract address
    const registryAddress = "0xYourRegistryContractAddress";
    const contract = new ethers.Contract(registryAddress, UserRegistry.abi, signer);

    try {
      const tx = await contract.register("21", "male", ["sports","music"]);
      await tx.wait();
      setStatus("✅ User registered successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Error registering user");
    }
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Monad Dating DApp ❤️</h1>
      <ConnectButton />
      <br />
      <button onClick={registerUser} style={{ marginTop: "20px" }}>
        Register User
      </button>
      <p>{status}</p>
    </div>
  )
}
