// client/src/components/voting/VoteConfirmation.jsx

const VoteConfirmation = ({ candidateName, voteId }) => {
  const timestamp = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-8 text-center max-w-md mx-auto">

      {/* Success icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 sm:mb-5">
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 text-green-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      
      <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">
        Vote Cast Successfully!
      </h2>

      <p className="text-sm text-gray-500 mb-5">
        Your vote has been securely recorded using blockchain technology.
      </p>

      {/* Voted for */}
      <div className="bg-blue-50 rounded-xl px-4 py-3 mb-4">
        <p className="text-xs text-gray-400 mb-1">You voted for</p>
        <p className="text-base sm:text-lg font-bold text-blue-700">{candidateName}</p>
      </div>

      {/* Meta info */}
      <div className="space-y-2 text-xs text-gray-400">
        <div className="flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {timestamp}
        </div>
        {voteId && (
          <div className="flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
            </svg>
            Vote ID: <span className="font-mono">{voteId}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteConfirmation;