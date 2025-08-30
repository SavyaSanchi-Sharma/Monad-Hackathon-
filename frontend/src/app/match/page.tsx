"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Match {
  id: string;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  location: string;
  score: number;
  avatar: string;
}

export default function MatchPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    // Check if wallet is connected
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        });
    }

    // Simulate loading matches
    setTimeout(() => {
      setMatches([
        {
          id: "1",
          name: "Sarah",
          age: 25,
          bio: "Adventure seeker and coffee enthusiast. Love hiking, photography, and trying new cuisines.",
          interests: ["hiking", "photography", "cooking", "travel"],
          location: "San Francisco, CA",
          score: 95,
          avatar: "👩‍🦰"
        },
        {
          id: "2",
          name: "Alex",
          age: 28,
          bio: "Tech geek by day, musician by night. Guitar, coding, and board games are my jam.",
          interests: ["music", "technology", "board games", "coffee"],
          location: "Austin, TX",
          score: 88,
          avatar: "👨‍💻"
        },
        {
          id: "3",
          name: "Emma",
          age: 23,
          bio: "Artist and nature lover. I paint landscapes and spend weekends exploring national parks.",
          interests: ["art", "nature", "hiking", "photography"],
          location: "Portland, OR",
          score: 92,
          avatar: "👩‍🎨"
        },
        {
          id: "4",
          name: "Michael",
          age: 30,
          bio: "Fitness trainer and foodie. Love helping people reach their goals and discovering new restaurants.",
          interests: ["fitness", "food", "travel", "motivation"],
          location: "Miami, FL",
          score: 85,
          avatar: "💪"
        }
      ]);
      setIsLoading(false);
    }, 1500);
  }, []);

  const filteredMatches = matches.filter(match => {
    if (filter === "all") return true;
    if (filter === "high") return match.score >= 90;
    if (filter === "medium") return match.score >= 80 && match.score < 90;
    if (filter === "low") return match.score < 80;
    return true;
  });

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">🔒 Wallet Required</h1>
          <p className="mb-6">Please connect your wallet to view matches</p>
          <Link 
            href="/"
            className="inline-block bg-gradient-to-r from-pink-400 to-purple-600 px-6 py-3 rounded-full font-semibold hover:scale-105 transition-transform"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-4">
            💕 Your Matches
          </h1>
          <p className="text-white/80 text-lg">
            Discover people who share your interests and values
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-2">
            <div className="flex space-x-2">
              {[
                { key: "all", label: "All Matches", color: "from-purple-500 to-pink-500" },
                { key: "high", label: "High Score (90+)", color: "from-green-500 to-emerald-500" },
                { key: "medium", label: "Medium (80-89)", color: "from-yellow-500 to-orange-500" },
                { key: "low", label: "Lower (<80)", color: "from-red-500 to-pink-500" }
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === key
                      ? `bg-gradient-to-r ${color} text-white shadow-lg scale-105`
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Matches Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mb-4"></div>
            <p className="text-white/70">Finding your perfect matches...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-2xl hover:scale-105 transition-all duration-300"
              >
                {/* Match Header */}
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{match.avatar}</div>
                  <h3 className="text-xl font-bold text-white mb-1">{match.name}</h3>
                  <p className="text-white/70">{match.age} years old</p>
                  <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full border border-pink-400/30">
                    <span className="text-pink-300 font-semibold">{match.score}%</span>
                    <span className="text-white/70 text-sm">Match</span>
                  </div>
                </div>

                {/* Match Details */}
                <div className="space-y-3">
                  <div>
                    <p className="text-white/90 text-sm leading-relaxed">{match.bio}</p>
                  </div>
                  
                  <div>
                    <p className="text-white/70 text-sm mb-2">📍 {match.location}</p>
                  </div>

                  <div>
                    <p className="text-white/70 text-sm mb-2">Interests:</p>
                    <div className="flex flex-wrap gap-2">
                      {match.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80 border border-white/20"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <button className="w-full py-3 px-4 bg-gradient-to-r from-pink-400 to-purple-600 rounded-xl text-white font-semibold hover:scale-105 transition-transform shadow-lg">
                    💬 Start Chat
                  </button>
                  <button className="w-full py-2 px-4 bg-white/10 border border-white/30 rounded-xl text-white/80 hover:bg-white/20 transition-colors">
                    👁️ View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Matches Message */}
        {!isLoading && filteredMatches.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="text-2xl font-bold text-white mb-2">No matches found</h3>
            <p className="text-white/70 mb-6">Try adjusting your filters or check back later</p>
            <button
              onClick={() => setFilter("all")}
              className="bg-gradient-to-r from-pink-400 to-purple-600 px-6 py-3 rounded-full text-white font-semibold hover:scale-105 transition-transform"
            >
              Show All Matches
            </button>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center mt-12">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
