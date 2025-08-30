const mockMatches = [
  { id: 1, name: "Alice", interest: "AI & Dance" },
  { id: 2, name: "Bob", interest: "Blockchain & Music" },
];

export default function Matches() {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-lg w-full">
      <h3 className="text-xl font-semibold mb-4">Your Matches 💫</h3>
      <ul>
        {mockMatches.map((match) => (
          <li
            key={match.id}
            className="p-3 border-b last:border-none hover:bg-purple-50 rounded"
          >
            <span className="font-bold">{match.name}</span> → {match.interest}
          </li>
        ))}
      </ul>
    </div>
  );
}
