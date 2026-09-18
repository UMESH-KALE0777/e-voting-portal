// client/src/components/admin/OverviewTab.jsx
import { useState } from "react";
import api from "../../utils/api";  

const OverviewTab = ({ stats, token, onRefresh }) => {
  const [resetConfirm, setResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);  
  const [resetError, setResetError] = useState("");  

  const handleResetVotes = async () => {
    try {
      setResetting(true);
      setResetError("");
      
      await api.post("/admin/reset-votes", { confirm: "RESET" });
      setResetConfirm(false);
      onRefresh();
    } catch (err) {
      console.error("Reset error:", err.response?.data || err.message);
      
      setResetError(err.response?.data?.message || "Failed to reset votes.");
    } finally {
      setResetting(false);
    }
  };

  if (!stats) return null;

  const statCards = [
    { label: "Total voters",   value: stats.totalVoters,    color: "text-blue-700",   bg: "bg-blue-50",   dot: "bg-blue-500"   },
    { label: "Votes cast",     value: stats.totalVotes,     color: "text-green-700",  bg: "bg-green-50",  dot: "bg-green-500"  },
    { label: "Candidates",     value: stats.totalCandidates,color: "text-purple-700", bg: "bg-purple-50", dot: "bg-purple-500" },
    { label: "Voter turnout",  value: `${stats.turnout}%`,  color: "text-orange-700", bg: "bg-orange-50", dot: "bg-orange-500" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">

       
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${s.dot}`} />
            </div>
            
            <p className={`text-xl sm:text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Turnout bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium text-gray-900">Voter turnout</p>
          <p className="text-sm font-bold text-blue-700">{stats.turnout}%</p>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-700"
            style={{ width: `${Math.min(stats.turnout, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>{stats.votedCount ?? 0} voted</span>
          <span>{(stats.totalVoters - (stats.votedCount ?? 0))} not voted</span>
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-red-100 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-1">
          <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <p className="text-sm font-semibold text-red-700">Danger zone</p>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Resetting votes clears all cast votes and resets all candidate tallies. This cannot be undone.
        </p>

         
        {resetError && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-3">
            {resetError}
          </p>
        )}

        {!resetConfirm ? (
          <button
            onClick={() => { setResetConfirm(true); setResetError(""); }}
            className="text-sm bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition"
          >
            Reset all votes
          </button>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs text-red-600 font-medium w-full sm:w-auto">
              Are you sure? This is irreversible.
            </p>
            <button
              onClick={handleResetVotes}
              disabled={resetting}
              className="text-sm bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-60 flex items-center gap-2"
            >
              {resetting && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {resetting ? "Resetting..." : "Yes, reset"}
            </button>
            <button
              onClick={() => { setResetConfirm(false); setResetError(""); }}
              disabled={resetting}
              className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-40"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default OverviewTab;