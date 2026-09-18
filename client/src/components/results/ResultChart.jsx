// client/src/components/results/ResultChart.jsx
const colors = [
  "bg-blue-500", "bg-orange-500", "bg-green-500",
  "bg-purple-500", "bg-red-500", "bg-teal-500",
];

const textColors = [
  "text-blue-600", "text-orange-600", "text-green-600",
  "text-purple-600", "text-red-600", "text-teal-600",
];

const ResultChart = ({ candidates, totalVotes }) => {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm9.75-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v10.125c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V9.75zm-9.75 3.375" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-900">Vote share analytics</p>
      </div>

      <div className="space-y-4">
        {candidates.map((candidate, i) => {
          const pct = totalVotes > 0
            ? Math.round((candidate.totalVotes / totalVotes) * 100)
            : 0;
          return (
            <div key={candidate._id}>
              <div className="flex justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${colors[i % colors.length]}`} />
                  <span className="text-sm font-medium text-gray-800">{candidate.name}</span>
                  <span className="text-xs text-gray-400 hidden sm:inline">· {candidate.party}</span>
                </div>
                <span className={`text-sm font-bold ${textColors[i % textColors.length]}`}>
                  {pct}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className={`${colors[i % colors.length]} h-3 rounded-full transition-all duration-700`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">
                {candidate.totalVotes.toLocaleString()} votes
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultChart;