// client/src/components/voting/VotingStatus.jsx

const VotingStatus = ({ totalVotes = 0, votingPercentage = 0, remainingTime = "—", loading = false }) => {
  const stats = [
    {
      value: loading ? "..." : totalVotes.toLocaleString(),
      label: "Total votes cast",
      color: "text-blue-700",
      bg: "bg-blue-50",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      value: loading ? "..." : `${votingPercentage}%`,
      label: "Voting percentage",
      color: "text-green-700",
      bg: "bg-green-50",
      bar: votingPercentage,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
      ),
    },
    {
      value: loading ? "..." : remainingTime,
      label: "Time remaining",
      color: "text-red-500",
      bg: "bg-red-50",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 text-center"
        >
          {/* Icon */}
          <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mx-auto mb-3`}>
            {stat.icon}
          </div>

          
          <p className={`text-2xl sm:text-3xl font-bold mb-1 ${stat.color}`}>
            {stat.value}
          </p>
          <p className="text-xs text-gray-400 mb-3">{stat.label}</p>

           
          {stat.bar !== undefined && (
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(stat.bar, 100)}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </section>
  );
};

export default VotingStatus;