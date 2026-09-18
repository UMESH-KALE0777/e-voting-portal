// client/src/components/home/CandidatePreview.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api"; 

const CandidatePreview = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await api.get("/candidates"); 
        setCandidates(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch candidates", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  const avatarColors = [
    { bg: "bg-blue-50", text: "text-blue-800" },
    { bg: "bg-amber-50", text: "text-amber-800" },
    { bg: "bg-purple-50", text: "text-purple-800" },
  ];

  if (loading) {
    return (
      <section>
        
        <div className="text-center mb-8">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
            Meet the candidates
          </p>
          <h2 className="text-xl font-semibold text-gray-900">Top candidates</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 text-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4" />
              <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto mb-1" />
              <div className="h-3 bg-gray-100 rounded w-2/3 mx-auto mb-4" />
              <div className="h-8 bg-gray-100 rounded-xl w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  
  if (candidates.length === 0) {
    return (
      <section>
        <div className="text-center mb-8">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
            Meet the candidates
          </p>
          <h2 className="text-xl font-semibold text-gray-900">Top candidates</h2>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600">No candidates yet</p>
          <p className="text-xs text-gray-400 mt-1">Candidates will appear here once registered.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="text-center mb-8">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
          Meet the candidates
        </p>
        <h2 className="text-xl font-semibold text-gray-900">Top candidates</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {candidates.map((candidate, i) => {
          const color = avatarColors[i % avatarColors.length];
          return (
            <div
              key={candidate._id}
              className="bg-white border border-gray-100 rounded-2xl p-6 text-center hover:shadow-sm transition"
            >
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold mx-auto mb-4 ${color.bg} ${color.text}`}
              >
                {getInitials(candidate.name)}
              </div>

              <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
                {candidate.name}
              </h3>

              <p className="text-xs text-gray-500 mb-1 truncate">{candidate.party}</p>
              <p className="text-xs text-gray-400 mb-4 truncate">{candidate.constituency}</p>

              <p className="text-xs text-gray-500 mb-5 leading-relaxed line-clamp-2">
                {candidate.manifesto || "No manifesto provided."}
              </p>

              <button
                onClick={() => navigate(`/candidate/${candidate._id}`)}
                className="w-full bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 text-gray-700 hover:text-blue-700 text-sm font-medium py-2 rounded-xl transition"
              >
                View profile
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/candidates")}
          className="text-sm text-blue-700 hover:underline font-medium"
        >
          View all candidates →
        </button>
      </div>
    </section>
  );
};

export default CandidatePreview;