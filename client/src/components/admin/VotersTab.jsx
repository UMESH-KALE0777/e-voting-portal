// client/src/components/admin/VotersTab.jsx
import { useState } from "react"; 

const getInitials = (name) =>
  name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

const VotersTab = ({ voters = [] }) => { 
  const [search, setSearch] = useState("");  

  const voted    = voters.filter((v) => v.hasVoted).length;
  const notVoted = voters.length - voted;

  
  const filtered = voters.filter((v) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      v.name?.toLowerCase().includes(q) ||
      v.email?.toLowerCase().includes(q) ||
      v.voterId?.toLowerCase().includes(q) ||
      v.constituency?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">

      
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[
          { label: "Total registered", value: voters.length,  color: "text-gray-900"  },
          { label: "Voted",            value: voted,           color: "text-green-700" },
          { label: "Not voted",        value: notVoted,        color: "text-gray-400"  },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 text-center">
            
            <p className={`text-xl sm:text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-1 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name, email, voter ID or constituency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Voter list */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900">
            Registered voters ({voters.length})
          </p>
          {search && (
            <p className="text-xs text-gray-400">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="divide-y divide-gray-50">
          {voters.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">No voters registered yet.</p>
            </div>
          )}

          {voters.length > 0 && filtered.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-400">No voters match your search.</p>
              <button onClick={() => setSearch("")} className="text-xs text-blue-600 hover:underline mt-1">
                Clear search
              </button>
            </div>
          )}

          {filtered.map((v) => (
            <div key={v._id} className="px-4 sm:px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition">
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center flex-shrink-0
                ${v.hasVoted ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                {getInitials(v.name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{v.name}</p>
                <p className="text-xs text-gray-400 truncate">
                  {v.email}
                </p>
                
                <p className="text-xs text-gray-300 truncate">
                  {v.constituency} · ID: {v.voterId}
                </p>
              </div>

              {/* Status badge */}
              <div className={`text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 whitespace-nowrap
                ${v.hasVoted
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-50 text-gray-400"
                }`}>
                {v.hasVoted ? "✓ Voted" : "Pending"}
              </div>
            </div>
          ))}
        </div>

        
        {voters.length > 0 && (
          <div className="px-4 sm:px-5 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Showing {filtered.length} of {voters.length} voters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotersTab;