"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bio: "",
    interests: "",
    location: "",
    lookingFor: "",
    email: "",
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Check if wallet is connected
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            // Get user name from localStorage or prompt
            const storedName = localStorage.getItem('userName');
            if (storedName) {
              setUserName(storedName);
              setFormData(prev => ({ ...prev, name: storedName }));
            }
          }
        });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save to localStorage for now (will be replaced with database)
      localStorage.setItem('userProfile', JSON.stringify(formData));
      localStorage.setItem('userName', formData.name);
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("Profile created successfully! 🎉");
    } catch (error) {
      alert("Error creating profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-4">🔒 Wallet Required</h1>
          <p className="mb-6">Please connect your wallet to create a profile</p>
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 mb-4">
            👤 Create Your Profile
          </h1>
          <p className="text-white text-xl font-medium">
            Tell us about yourself to find your perfect match
          </p>
          {userName && (
            <div className="mt-4 p-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl border border-green-400/30">
              <p className="text-white font-semibold">
                Welcome back, <span className="text-cyan-300">{userName}</span>! 💕
              </p>
            </div>
          )}
        </div>

        {/* Profile Form */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-black text-sm font-semibold mb-2 bg-white/80 px-2 py-1 rounded">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2 bg-white/80 px-2 py-1 rounded">
                  Age *
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  min="18"
                  max="100"
                  className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Your age"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-black text-sm font-semibold mb-2 bg-white/80 px-2 py-1 rounded">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2 bg-white/80 px-2 py-1 rounded">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Gender and Looking For */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-black text-sm font-semibold mb-2 bg-white/80 px-2 py-1 rounded">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-black text-sm font-semibold mb-2 bg-white/80 px-2 py-1 rounded">
                  Looking For *
                </label>
                <select
                  name="lookingFor"
                  value={formData.lookingFor}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select preference</option>
                  <option value="male">Men</option>
                  <option value="female">Women</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-black text-sm font-semibold mb-2 bg-white/80 px-2 py-1 rounded">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="City, State, Country"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-black text-sm font-semibold mb-2 bg-white/80 px-2 py-1 rounded">
                Bio *
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about yourself, your interests, and what you're looking for..."
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-black text-sm font-semibold mb-2 bg-white/80 px-2 py-1 rounded">
                Interests & Hobbies
              </label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/90 border border-gray-300 rounded-xl text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., music, travel, cooking, sports, technology, art..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all transform ${
                  isSubmitting
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-pink-400 to-purple-600 hover:scale-105 hover:shadow-pink-400/50 active:scale-95"
                } text-white shadow-xl`}
              >
                {isSubmitting ? "⏳ Creating Profile..." : "💕 Create Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* Back Button */}
        <div className="text-center mt-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-cyan-300 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
