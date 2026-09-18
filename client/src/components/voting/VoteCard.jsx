// client/src/components/voting/VoteCard.jsx
 
import { useState } from "react";

// const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const VoteCard = ({ candidate, onVote, hasVoted = false, isLoading = false }) => {
  const [imgError, setImgError] = useState(false);

  const getInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  const showImage = candidate?.image && !imgError;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition duration-300">

    
      {showImage ? (
        <img
          src={ candidate.image }
          alt={candidate.name}
          onError={() => setImgError(true)}
          className="w-full h-40 sm:h-52 object-cover"
        />
      ) : (
        <div className="w-full h-40 sm:h-52 bg-blue-50 flex items-center justify-center">
          <span className="text-4xl sm:text-5xl font-bold text-blue-300">
            {getInitials(candidate?.name)}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-blue-700 mb-1 truncate">
          {candidate?.name}
        </h2>

        <p className="text-sm text-gray-500 mb-1 truncate">{candidate?.party}</p>
        <p className="text-xs text-gray-400 mb-3 truncate">{candidate?.constituency}</p>

        <p className="text-sm text-gray-600 leading-relaxed mb-5 line-clamp-3">
          {candidate?.manifesto || "No manifesto provided."}
        </p>

        
        <button
          onClick={() => onVote?.(candidate._id)}
          disabled={hasVoted || isLoading}
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition
            ${hasVoted
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : isLoading
              ? "bg-green-400 text-white cursor-wait"
              : "bg-green-600 hover:bg-green-700 text-white"
            }`}
        >
          {hasVoted ? "Already voted" : isLoading ? "Submitting..." : "Cast vote"}
        </button>
      </div>
    </div>
  );
};

export default VoteCard;