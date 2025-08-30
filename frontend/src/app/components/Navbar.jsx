import WalletConnect from "./WalletConnect";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-purple-600 text-white shadow-lg">
      <h2 className="text-2xl font-bold">CrushCredits ❤️</h2>
      <WalletConnect />
    </nav>
  );
}
