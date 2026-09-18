// client/src/pages/CastVote.jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { ElectionContext } from "../context/ElectionContext";

const CastVote = () => {
  const { user } = useContext(AuthContext);
  const { election } = useContext(ElectionContext);
  const [allCandidates, setAllCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userConstituency = user?.constituency || "";

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await api.get("/candidates");
        setAllCandidates(data);
      } catch {
        setError("Failed to load candidates.");
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  useEffect(() => {
    if (user?.hasVoted) navigate("/my-vote");
  }, [user, navigate]);

  const candidates = allCandidates.filter((c) => {

    const normalizeConstituency = (str) => {
      return str
        ?.toLowerCase()
        .trim()
        .replace(/\s+lok\s+sabha\s*$/i, '')
        .replace(/\s+/g, ' ')
        .trim();
    };



    const normalizedUserConst = normalizeConstituency(userConstituency);
    const normalizedCandidateConst = normalizeConstituency(c.constituency);

    return normalizedUserConst === normalizedCandidateConst;
  });

  const isElectionEnded =
    election?.status === "ended" ||
    (election?.endDate && new Date(election.endDate) < new Date());

  const handleVote = async () => {
    if (!selected) { setError("Please select a candidate before submitting."); return; }
    if (isElectionEnded) { setError("Voting has ended."); return; }
    try {
      setSubmitting(true);
      setError("");
      await api.post("/votes/cast", { candidateId: selected });
      navigate("/my-vote");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cast vote. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

  const avatarColors = [
    { bg: "bg-blue-50", text: "text-blue-800" },
    { bg: "bg-amber-50", text: "text-amber-800" },
    { bg: "bg-purple-50", text: "text-purple-800" },
    { bg: "bg-green-50", text: "text-green-800" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (user?.hasVoted) return (
    <div className="max-w-md mx-auto py-16 px-4 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">You have already voted!</h2>
      <p className="text-sm text-gray-500 mb-6">Your vote has been recorded. Each citizen can vote only once.</p>
      <Link to="/my-vote" className="inline-block bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition">
        View my vote receipt
      </Link>
    </div>
  );

  if (isElectionEnded) return (
    <div className="max-w-md mx-auto py-16 px-4 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Voting has ended</h2>
      <p className="text-sm text-gray-500 mb-6">The election period is over. Check the results page.</p>
      <Link to="/results" className="inline-block bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition">
        View results
      </Link>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-800 text-xs font-medium px-4 py-1.5 rounded-full mb-3">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          {election?.title || "Election"} — Voting is open
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Cast your vote</h1>
        <p className="text-sm text-gray-500">Choose your candidate carefully</p>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-blue-500 font-medium">Your registered constituency</p>
          <p className="text-sm font-bold text-blue-800 truncate">{userConstituency} Lok Sabha</p>
        </div>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium flex-shrink-0">Locked 🔒</span>
      </div>

      {candidates.length === 0 ? (
        <div className="text-center py-12 bg-white border border-gray-100 rounded-2xl">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-600 font-medium">No candidates in {userConstituency}</p>
          <p className="text-xs text-gray-400 mt-1">Admin has not added candidates for your constituency yet.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-3 px-1">
            {candidates.length} candidate{candidates.length > 1 ? "s" : ""} in <strong>{userConstituency}</strong>
          </p>

          <div className="space-y-3 mb-4">
            {candidates.map((candidate, i) => {
              const color = avatarColors[i % avatarColors.length];
              const isSelected = selected === candidate._id;
              return (
                <div
                  key={candidate._id}
                  onClick={() => setSelected(candidate._id)}
                  className={`bg-white rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all
                    ${isSelected ? "border-2 border-blue-600 shadow-sm bg-blue-50/30" : "border border-gray-100 hover:border-gray-300"}`}
                >
                  <div className="flex-shrink-0">
                    {candidate.image ? (
                      <img
                        src={ candidate.image }
                        alt={candidate.name}
                        onError={(e) => { e.target.style.display = "none"; }}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold ${color.bg} ${color.text}`}>
                        {getInitials(candidate.name)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{candidate.name}</p>
                    <p className="text-xs text-gray-500 font-medium">{candidate.party}</p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{candidate.manifesto}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition
                    ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
            <svg className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-xs text-amber-800">
              Once submitted, your vote <strong>cannot be changed</strong>. You can vote only once.
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-600 text-center mb-3 bg-red-50 border border-red-100 rounded-xl py-2.5 px-3">{error}</p>
          )}

          <button
            onClick={handleVote}
            disabled={!selected || submitting}
            className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2
              ${selected && !submitting
                ? "bg-blue-700 hover:bg-blue-800 active:scale-95 text-white shadow-md"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : selected ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Confirm vote for {candidates.find((c) => c._id === selected)?.name}
              </>
            ) : "Select a candidate to continue"}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            End-to-end encrypted · One vote per citizen
          </p>
        </>
      )}
    </div>
  );
};

export default CastVote;