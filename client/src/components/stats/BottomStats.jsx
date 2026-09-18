// C:\secure-online-voting-system\client\src\components\stats\BottomStats.jsx
const BottomStats = ({ totalCandidates, remainingDays }) => {
  return (
    <div className="grid grid-cols-2 gap-4">

      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-700 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900">{totalCandidates}</p>
          <p className="text-xs text-gray-500">Candidates running</p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold text-gray-900">{remainingDays} days</p>
          <p className="text-xs text-gray-500">Voting time remaining</p>
        </div>
      </div>

    </div>
  );
};

export default BottomStats;