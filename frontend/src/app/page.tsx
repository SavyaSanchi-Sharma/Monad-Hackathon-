"use client";

import { useEffect, useRef, useState } from "react";
import { addMonadTestnet, getNetworkConfig } from "../config/contracts";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function HomePage() {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [networkName, setNetworkName] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  /* --------------------------
     Wallet connection logic
     -------------------------- */
  const connectWallet = async () => {
    try {
      setIsLoading(true);
      if (!window.ethereum) {
        setError("MetaMask not found. Install it to connect.");
        return;
      }
      const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts?.length > 0) {
        setAccount(accounts[0]);
        setError(null);
      }
      const networkId = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(networkId);
      updateNetworkName(networkId);
    } catch (err: any) {
      console.error("MetaMask Connection Error:", err?.message ?? err);
      setError(err?.message ?? "Failed to connect to MetaMask");
    } finally {
      setIsLoading(false);
    }
  };

  const addMonadNetwork = async () => {
    try {
      setIsLoading(true);
      const success = await addMonadTestnet();
      if (success) {
        setError(null);
        // Switch to Monad testnet
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x279f' }],
        });
      } else {
        setError("Failed to add Monad testnet");
      }
    } catch (err: any) {
      console.error("Add Monad Network Error:", err?.message ?? err);
      setError(err?.message ?? "Failed to add Monad testnet");
    } finally {
      setIsLoading(false);
    }
  };

  const updateNetworkName = (chainId: string) => {
    if (chainId === "0x539") {
      setNetworkName("Localhost");
    } else if (chainId === "0x279f") {
      setNetworkName("Monad Testnet");
    } else {
      setNetworkName("Unknown Network");
    }
  };

  // Detect already connected accounts + listen for changes
  useEffect(() => {
    if (window.ethereum) {
      (async () => {
        try {
          const accounts: string[] = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) setAccount(accounts[0]);
          const chain = await window.ethereum.request({ method: "eth_chainId" });
          setChainId(chain);
          updateNetworkName(chain);
        } catch (err) {
          console.error("Auto-connect error:", err);
        }
      })();

      const handleAccounts = (accs: string[]) => {
        if (accs.length > 0) {
          setAccount(accs[0]);
          setError(null);
        } else setAccount(null);
      };
      const handleChain = (chainId: string) => {
        setChainId(chainId);
        updateNetworkName(chainId);
      };

      window.ethereum.on("accountsChanged", handleAccounts);
      window.ethereum.on("chainChanged", handleChain);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccounts);
        window.ethereum.removeListener("chainChanged", handleChain);
      };
    }
  }, []);

  /* --------------------------
     Floating heart particles
     -------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const DPR = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(DPR, DPR);

    type Particle = {
      x: number;
      y: number;
      size: number;
      speedY: number;
      alpha: number;
      sway: number;
      lifetime: number;
      text: string;
    };

    const particles: Particle[] = [];
    function spawn() {
      particles.push({
        x: Math.random() * w,
        y: h + 20,
        size: 14 + Math.random() * 18,
        alpha: 0.7,
        speedY: 0.5 + Math.random() * 1.2,
        sway: Math.random() * 0.02,
        lifetime: 8 + Math.random() * 8,
        text: Math.random() > 0.5 ? "❤️" : "💜",
      });
    }

    let last = performance.now();
    function loop(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      ctx.clearRect(0, 0, w, h);

      if (particles.length < 60 && Math.random() < 0.2) spawn();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.y -= p.speedY;
        p.alpha -= 0.001;
        p.lifetime -= dt;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = "center";
        ctx.fillText(p.text, p.x, p.y);
        ctx.restore();

        if (p.y < -20 || p.alpha <= 0 || p.lifetime <= 0) {
          particles.splice(i, 1);
        }
      }
      animationRef.current = requestAnimationFrame(loop);
    }
    animationRef.current = requestAnimationFrame(loop);

    window.addEventListener("resize", () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    });

    return () => cancelAnimationFrame(animationRef.current!);
  }, []);

  /* --------------------------
     Render
     -------------------------- */
  return (
    <div className="relative min-h-screen overflow-hidden font-sans bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900">
      {/* VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-30 opacity-40"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      {/* Enhanced gradient overlay */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(1200px 400px at 10% 10%, rgba(255,100,200,0.25), transparent), " +
            "radial-gradient(800px 600px at 90% 20%, rgba(100,100,255,0.2), transparent), " +
            "linear-gradient(135deg, rgba(255,140,180,0.15), rgba(110,80,250,0.2))",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none" />

      {/* Central UI card */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-[900px] bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-12 shadow-2xl text-center">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 drop-shadow-2xl">
              💞 PROOF OF LOVE
            </h1>
            <p className="text-white/95 mb-6 max-w-3xl mx-auto text-xl font-medium leading-relaxed">
              Find trustworthy, transparent matches powered by AI & recorded on-chain. 
              <span className="text-cyan-300 font-semibold"> Fast, private, and built for love</span> ❤️
            </p>
          </div>

          {/* Name Input Section */}
          {!account && (
            <div className="mb-8">
              <div className="max-w-md mx-auto">
                <label className="block text-left text-white/90 text-sm font-medium mb-2">
                  What's your name?
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name..."
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          {/* Wallet Section */}
          {!account ? (
            <div className="space-y-4">
              <button
                onClick={connectWallet}
                disabled={isLoading || !userName.trim()}
                className={`inline-flex items-center gap-3 rounded-full px-8 py-4 font-bold text-lg shadow-2xl transition-all transform ${
                  isLoading || !userName.trim()
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-br from-pink-400 to-purple-600 hover:scale-105 hover:shadow-pink-400/50 active:scale-95"
                } text-white`}
              >
                {isLoading ? "⏳ Connecting..." : "🔗 Connect Wallet"}
              </button>
              
              {!userName.trim() && (
                <p className="text-pink-300 text-sm">Please enter your name first</p>
              )}
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 px-6 py-4 rounded-2xl border border-green-400/30">
              <div className="text-lg text-green-300 font-bold mb-2">✅ Wallet Connected</div>
              <div className="text-white/90 mb-2">
                <span className="text-cyan-300 font-semibold">Welcome, {userName}!</span>
              </div>
              <div className="font-mono text-sm text-white/80 break-words mb-2">{account}</div>
              <div className="text-sm text-blue-300">
                Network: <span className="font-semibold">{networkName}</span>
                {chainId && <span className="ml-2 text-xs">({chainId})</span>}
              </div>
            </div>
          )}

          {/* Network Management */}
          {account && (
            <div className="mt-6 space-y-3">
              <button
                onClick={addMonadNetwork}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-xl hover:scale-105 hover:shadow-blue-400/50 transition-all"
              >
                🌐 Add Monad Testnet
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-400/30 rounded-xl">
              <div className="text-red-300 text-sm">{error}</div>
            </div>
          )}

          {/* Action Links */}
          {account && (
            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
              <a
                href="/profile"
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-white hover:from-pink-500/30 hover:to-purple-500/30 transition-all border border-white/20 hover:border-white/40"
              >
                👤 Create Profile
              </a>
              <a
                href="/match"
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-all border border-white/20 hover:border-white/40"
              >
                💕 View Matches
              </a>
            </div>
          )}

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-white/20">
            <p className="text-sm text-white/60">
              Built on <span className="text-cyan-300 font-semibold">Monad</span> — fast L1 for real-time dApps
            </p>
            <p className="text-xs text-white/40 mt-2">
              Chain ID: 10135 (Testnet) | 1337 (Localhost)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
