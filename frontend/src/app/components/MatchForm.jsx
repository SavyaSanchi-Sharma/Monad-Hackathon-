import { useState } from "react";

export default function MatchForm() {
  const [name, setName] = useState("");
  const [interest, setInterest] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    alert(`Submitted: ${name}, Interest: ${interest}`);
    setName("");
    setInterest("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-xl p-6 max-w-md w-full mb-8"
    >
      <h3 className="text-xl font-semibold mb-4">Enter Your Preferences</h3>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />
      <input
        type="text"
        placeholder="Your Interest"
        value={interest}
        onChange={(e) => setInterest(e.target.value)}
        className="w-full border p-2 rounded mb-3"
      />
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition"
      >
        Submit
      </button>
    </form>
  );
}
