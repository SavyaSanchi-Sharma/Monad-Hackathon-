import Navbar from "./components/Navbar";
import MatchForm from "./components/MatchForm";
import Matches from "./components/Matches";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-white to-blue-200">
      <Navbar />
      <main className="p-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center text-purple-700 mb-6">
          Blockchain Matchmaking DApp 💜
        </h1>
        <MatchForm />
        <Matches />
      </main>
    </div>
  );
}
