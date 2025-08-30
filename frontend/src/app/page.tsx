"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function HomePage() {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  /* --------------------------
     Wallet connection logic
     -------------------------- */
  const connectWallet = async () => {
    try {
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
    } catch (err: any) {
      console.error("MetaMask Connection Error:", err?.message ?? err);
      setError(err?.message ?? "Failed to connect to MetaMask");
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
        } catch (err) {
          console.error("Auto-connect error:", err);
        }
      })();

      const handleAccounts = (accs: string[]) => {
        if (accs.length > 0) {
          setAccount(accs[0]);
          setError(null);
        } else {
          setAccount(null);
        }
      };
      const handleChain = (chainId: string) => setChainId(chainId);

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
        speedY: 0.5 + Math.random() * 1.2,
        alpha: 0.7,
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
    <div className="relative min-h-screen overflow-hidden font-sans">
      {/* Gradient + SVG blobs */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          background:
            "radial-gradient(1200px 400px at 10% 10%, rgba(255,200,230,0.15), transparent), " +
            "linear-gradient(135deg, rgba(255,140,180,0.06), rgba(110,80,250,0.08))",
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 -z-0 pointer-events-none" />

      {/* Card UI */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-[820px] bg-white/6 backdrop-blur-md border border-white/12 rounded-3xl p-10 shadow-2xl text-center">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-md mb-3">
            💞 CrushCredits — Matchmaking DApp
          </h1>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Find trustworthy, transparent matches powered by AI & recorded on-chain.
          </p>

          {/* Wallet Section */}
          {!account ? (
            <button
              onClick={connectWallet}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-yellow-300 to-pink-400 px-6 py-3 font-semibold text-black shadow-xl hover:scale-105 transition"
            >
              🔗 Connect Wallet
            </button>
          ) : (
            <div className="bg-white/8 px-4 py-3 rounded-xl">
              <div className="text-sm text-green-300 font-semibold">✅ Connected</div>
              <div className="mt-1 font-mono text-sm text-white break-words">{account}</div>
              <div className="mt-1 text-xs text-pink-200">
                Network: {chainId ? chainId : "Unknown"}
              </div>
            </div>
          )}

          {error && <div className="text-sm text-red-300 mt-2">{error}</div>}

          {/* Links */}
          <div className="mt-6 grid grid-cols-2 gap-3 w-full max-w-md mx-auto">
            <a
              href="/profile"
              className="py-2 rounded-lg bg-white/8 text-white hover:bg-white/12 transition text-sm"
            >
              Create Profile
            </a>
            <a
              href="/match"
              className="py-2 rounded-lg bg-white/8 text-white hover:bg-white/12 transition text-sm"
            >
              View Matches
            </a>
          </div>
          <p className="mt-6 text-xs text-white/60">Built on Monad — fast L1 for real-time dApps</p>
        </div>
      </div>
    </div>
  );
}
