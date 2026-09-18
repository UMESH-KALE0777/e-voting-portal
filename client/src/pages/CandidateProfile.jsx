// client/src/pages/CandidateProfile.jsx
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api"; 
import { ElectionContext } from "../context/ElectionContext";

// const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const partySymbols = {
  "BJP": "🪷", "Congress": "✋", "BSP": "🐘", "SP": "🚲",
  "AAP": "🧹", "TMC": "🌸", "Bhim army": "⚡", "default": "🏛",
};

const partyColors = {
  "BJP":       { bg: "from-orange-600 to-orange-500", badge: "bg-orange-50 text-orange-700 border-orange-200" },
  "Congress":  { bg: "from-blue-800 to-blue-700",    badge: "bg-blue-50 text-blue-700 border-blue-200" },
  "BSP":       { bg: "from-blue-600 to-indigo-600",  badge: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  "SP":        { bg: "from-red-600 to-red-500",      badge: "bg-red-50 text-red-700 border-red-200" },
  "AAP":       { bg: "from-blue-500 to-cyan-500",    badge: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  "Bhim army": { bg: "from-blue-700 to-blue-600",    badge: "bg-blue-50 text-blue-700 border-blue-200" },
  "default":   { bg: "from-blue-700 to-blue-600",    badge: "bg-blue-50 text-blue-700 border-blue-200" },
};

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { election } = useContext(ElectionContext); 
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [error, setError] = useState("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const { data } = await api.get(`/candidates/${id}`);
        setCandidate(data);
      } catch {
        setError("Failed to load candidate.");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id]);

  const handleVote = async () => {
    try {
      setVoting(true);
      setError("");
      await api.post("/votes/cast", { candidateId: candidate._id });
      setVoted(true);
      setTimeout(() => navigate("/my-vote"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cast vote.");
    } finally {
      setVoting(false);
    }
  };

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!candidate) return (
    <div className="text-center py-20 text-sm text-gray-400">Candidate not found.</div>
  );

  
  const now = new Date();
  const isElectionActive =
    election?.startDate &&
    election?.endDate &&
    now >= new Date(election.startDate) &&
    now <= new Date(election.endDate);

  const goals = candidate.manifesto?.split(",").map((g) => g.trim()).filter(Boolean) || [];
  const hasImage = candidate.image && candidate.image !== "" && !imgError;
  const symbol = partySymbols[candidate.party] || partySymbols["default"];
  const colors = partyColors[candidate.party] || partyColors["default"];

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className={`relative bg-gradient-to-br ${colors.bg} px-6 pt-10 pb-20 text-center overflow-hidden`}>
          <div className="absolute top-4 left-6 w-20 h-20 rounded-full border border-white/10" />
          <div className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/10" />
          <div className="absolute bottom-6 left-16 w-14 h-14 rounded-full border border-white/10" />
          <div className="absolute -bottom-4 right-10 w-24 h-24 rounded-full border border-white/10" />

          <div className="absolute top-4 right-4">
            <div className="bg-white/15 backdrop-blur rounded-xl px-3 py-1.5 flex items-center gap-1.5">
              <span className="text-lg">{symbol}</span>
              <span className="text-xs font-medium text-white">{candidate.party}</span>
            </div>
          </div>

          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/30 mx-auto shadow-xl">
              {hasImage ? (
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full bg-white/20 flex items-center justify-center text-3xl font-bold text-white">
                  {getInitials(candidate.name)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow-md">
              <svg className="w-3 h-3 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
              <span className="text-xs font-bold text-blue-700">{candidate.totalVotes ?? 0}</span>
            </div>
          </div>

          <h1 className="text-xl font-bold text-white mb-1">{candidate.name}</h1>
          <p className="text-sm text-white/70 mb-3">{candidate.party}</p>
          <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
            <svg className="w-3 h-3 text-white/70" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="text-xs text-white/80">{candidate.constituency} Lok Sabha</span>
          </div>
        </div>

        {/* Stats strip */}
        <div className="mx-5 -mt-10 bg-white border border-gray-100 rounded-2xl shadow-md grid grid-cols-3 divide-x divide-gray-100 mb-5 relative z-10">
          {[
            { label: "Age", value: candidate.age ? `${candidate.age} yrs` : "—" },
            { label: "Experience", value: candidate.experience || "—" },
            { label: "Education", value: candidate.education || "—" },
          ].map((s) => (
            <div key={s.label} className="px-3 py-3 text-center hover:bg-gray-50 transition">
              <p className="text-sm font-bold text-gray-900 leading-tight truncate">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="px-5 pb-6 space-y-3">
          <div className={`inline-flex items-center gap-2 border rounded-full px-3 py-1.5 ${colors.badge}`}>
            <span className="text-base">{symbol}</span>
            <span className="text-xs font-semibold">{candidate.party}</span>
          </div>

          {/* Manifesto */}
          <div className="border border-gray-100 rounded-2xl p-4 hover:border-blue-100 hover:bg-blue-50/30 transition">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-gray-900">Manifesto</p>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {candidate.manifesto || "No manifesto provided."}
            </p>
          </div>

          {/* Goals */}
          {goals.length > 0 && (
            <div className="border border-gray-100 rounded-2xl p-4 hover:border-green-100 hover:bg-green-50/30 transition">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-green-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-900">Development goals</p>
              </div>
              <div className="space-y-2">
                {goals.map((goal, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 hover:bg-green-50 hover:translate-x-1 rounded-xl px-3 py-2.5 transition-all duration-200 cursor-default">
                    <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-700">{goal}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Candidate ID */}
          <div className="border border-dashed border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700">Candidate ID</p>
              <p className="text-xs text-gray-400 font-mono truncate">{candidate._id}</p>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 text-center bg-red-50 border border-red-100 rounded-xl py-2.5">{error}</p>
          )}

           
          {!isElectionActive ? (
            <div className="w-full bg-gray-50 border border-gray-200 text-gray-500 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {election?.endDate && new Date() > new Date(election.endDate)
                ? "Voting has ended"
                : "Voting not yet open"}
            </div>
          ) : voted ? (
            <div className="w-full bg-green-50 border border-green-200 text-green-700 py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Vote recorded! Redirecting...
            </div>
          ) : (
            <button
              onClick={handleVote}
              disabled={voting}
              className={`w-full bg-gradient-to-r ${colors.bg} hover:opacity-90 active:scale-95 text-white py-3.5 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60`}
            >
              {voting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <span className="text-base">{symbol}</span>
                  Vote for {candidate.name}
                </>
              )}
            </button>
          )}

          <p className="text-xs text-gray-400 text-center flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            Secured by blockchain · End-to-end encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;