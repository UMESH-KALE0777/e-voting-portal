// client/src/pages/Candidates.jsx
import { useEffect, useState } from "react";
import CandidateCard from "../components/candidate/CandidateCard";
import { getCandidates } from "../services/candidateService";

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("all");
  const [selectedParty, setSelectedParty] = useState("all");

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCandidates();
      setCandidates(data);
    } catch (err) {
      
      console.error("Candidates fetch error:", err);
      setError("Failed to load candidates. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const constituencies = ["all", ...new Set(candidates.map((c) => c.constituency))].sort();
  const parties = ["all", ...new Set(candidates.map((c) => c.party))].sort();

  const filtered = candidates.filter((c) => {
    const matchConstituency = selectedConstituency === "all" || c.constituency === selectedConstituency;
    const matchParty = selectedParty === "all" || c.party === selectedParty;
    return matchConstituency && matchParty;
  });

   
  if (loading) return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="text-center mb-6">
        <div className="h-3 bg-gray-100 rounded w-40 mx-auto mb-2 animate-pulse" />
        <div className="h-6 bg-gray-100 rounded w-56 mx-auto mb-2 animate-pulse" />
        <div className="h-3 bg-gray-100 rounded w-32 mx-auto animate-pulse" />
      </div>
      <div className="flex gap-3 mb-6">
        <div className="flex-1 h-10 bg-gray-100 rounded-xl animate-pulse" />
        <div className="flex-1 h-10 bg-gray-100 rounded-xl animate-pulse" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-4 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-3" />
            <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto mb-2" />
            <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );

  
  if (error) return (
    <div className="max-w-md mx-auto py-20 px-4 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H2.645c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0l7.354 12.748zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-700 mb-1">Could not load candidates</p>
      <p className="text-xs text-gray-400 mb-4">{error}</p>
      <button
        onClick={fetchCandidates}
        className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl transition"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="text-center mb-6">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
          India General Election 2026
        </p>
        <h1 className="text-2xl font-semibold text-gray-900">Election candidates</h1>
        <p className="text-sm text-gray-500 mt-1">{candidates.length} candidates registered</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={selectedConstituency}
          onChange={(e) => setSelectedConstituency(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All constituencies</option>
          {constituencies.filter((c) => c !== "all").map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={selectedParty}
          onChange={(e) => setSelectedParty(e.target.value)}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">All parties</option>
          {parties.filter((p) => p !== "all").map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        {(selectedConstituency !== "all" || selectedParty !== "all") && (
          <button
            onClick={() => { setSelectedConstituency("all"); setSelectedParty("all"); }}
            className="px-4 py-2.5 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-xs text-gray-400 mb-4">
        Showing {filtered.length} of {candidates.length} candidates
        {selectedConstituency !== "all" && ` in ${selectedConstituency}`}
        {selectedParty !== "all" && ` · ${selectedParty}`}
      </p>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 mb-1">No candidates found</p>
          <p className="text-xs text-gray-400 mb-3">Try changing or clearing your filters.</p>
          <button
            onClick={() => { setSelectedConstituency("all"); setSelectedParty("all"); }}
            className="text-sm text-blue-700 hover:underline font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((candidate, index) => (
            <CandidateCard
              key={candidate._id}
              candidate={candidate}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Candidates;