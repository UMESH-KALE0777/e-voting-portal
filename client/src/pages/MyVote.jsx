// client/src/pages/MyVote.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import api from "../utils/api"; 
  const MyVote = () => {
  const [vote, setVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); 
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const fetchMyVote = async () => {
      try {
        const { data } = await api.get("/votes/my-vote");
        setVote(data);
      } catch (err) {
        
        if (err.response?.status !== 404) {
          console.error("MyVote fetch error:", err);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMyVote();
  }, []);

   
  if (loading) return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm animate-pulse">
        <div className="h-36 bg-green-100" />
        <div className="p-5 space-y-3">
          <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto" />
          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl px-3 py-2.5 h-14" />
            ))}
          </div>
          <div className="h-10 bg-gray-100 rounded-xl" />
        </div>
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
      <p className="text-sm font-medium text-gray-700 mb-1">Could not load your vote</p>
      <p className="text-xs text-gray-400 mb-4">Please check your connection and try again.</p>
      <button
        onClick={() => window.location.reload()}
        className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl transition"
      >
        Retry
      </button>
    </div>
  );

  if (!vote) return (
    <div className="max-w-lg mx-auto py-20 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-gray-600 text-sm font-medium mb-1">You have not cast a vote yet.</p>
      <p className="text-gray-400 text-xs mb-5">Participate in the election before voting closes.</p>
       
      <Link
        to="/cast-vote"
        className="inline-block bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
      >
        Go to Cast Vote
      </Link>
    </div>
  );

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

  const votedAt = new Date(vote.createdAt);
  const date = votedAt.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const time = votedAt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + " IST";
  const hasImage = vote.candidate?.image && !imgError;

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">

        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 to-green-500 px-6 py-8 text-center relative overflow-hidden">
          <div className="absolute top-3 left-6 w-16 h-16 rounded-full border border-white/10" />
          <div className="absolute bottom-2 right-8 w-20 h-20 rounded-full border border-white/10" />
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-xs font-semibold text-green-100 uppercase tracking-widest mb-1">Vote confirmed ✓</p>
          <p className="text-xs text-green-200">India General Election 2026</p>
        </div>

        <div className="p-5">
          <p className="text-xs text-gray-400 text-center mb-4">
            Your vote has been securely recorded. Below is your official vote receipt.
          </p>

          {/* Candidate card */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-medium">You voted for</p>
            <div className="flex items-center gap-3">
              {hasImage ? (
                <img
                  src={vote.candidate?.image}
                  alt={vote.candidate?.name}
                  onError={() => setImgError(true)}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-800 text-lg font-bold flex items-center justify-center flex-shrink-0">
                  {getInitials(vote.candidate?.name)}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-base font-bold text-gray-900 truncate">{vote.candidate?.name}</p>
                <p className="text-xs text-gray-500 truncate">{vote.candidate?.party}</p>
                <div className="flex items-center gap-1 mt-1">
                  <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <p className="text-xs text-gray-400 truncate">{vote.candidate?.constituency}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: "Date", value: date },
              { label: "Time", value: time },
              { label: "Constituency", value: vote.candidate?.constituency || "—" },
              { label: "Status", value: "✓ Recorded", green: true },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2.5">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                <p className={`text-sm font-semibold truncate ${item.green ? "text-green-700" : "text-gray-900"}`}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Receipt ID */}
          <div className="border border-dashed border-gray-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Receipt ID</p>
            <p className="text-xs font-mono text-gray-600 break-all">{vote._id}</p>
          </div>

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-100 rounded-xl py-2.5 px-4">
            <svg className="w-3.5 h-3.5 text-green-700 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <p className="text-xs text-green-700 font-medium text-center">
              End-to-end encrypted · Identity kept confidential
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyVote;
