// client/src/components/candidates/CandidateCard.jsx
import { Link } from "react-router-dom";

const partyColors = [
  "border-blue-500", "border-orange-500", "border-green-500",
  "border-purple-500", "border-red-500", "border-teal-500",
];

const getInitials = (name) =>
  name?.split(" ").map((n) => n[0]).join("").toUpperCase();

const CandidateCard = ({ candidate, index = 0 }) => {
  const borderColor = partyColors[index % partyColors.length];

  return (
    <div className={`bg-white border-2 ${borderColor} rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col`}>

      {/* Image */}
      <div className="relative w-full h-40 sm:h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
        {candidate.image ? (
          <img
           src={candidate.image}
          alt={candidate.name}
            onError={(e) => { e.target.style.display = "none"; }}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-50 text-blue-800 text-2xl sm:text-3xl font-bold flex items-center justify-center">
            {getInitials(candidate.name)}
          </div>
        )}

        {candidate.totalVotes > 0 && (
          <div className="absolute top-2 right-2 bg-white border border-gray-100 shadow-sm rounded-full px-2 py-0.5 flex items-center gap-1">
            <svg className="w-3 h-3 text-blue-700" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span className="text-xs font-semibold text-gray-700">{candidate.totalVotes}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4 text-center flex flex-col flex-1">
        <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-1 leading-tight">
          {candidate.name}
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-blue-700 mb-2">
          {candidate.party}
        </p>
        <div className="flex items-center justify-center gap-1 text-gray-400 mb-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <p className="text-xs text-gray-500 truncate">{candidate.constituency}</p>
        </div>
        <p className="text-xs text-gray-400 mb-3">{candidate.education}</p>
        <div className="mt-auto">
          <Link
            to={`/candidate/${candidate._id}`}
            className="inline-block w-full bg-blue-700 hover:bg-blue-800 active:scale-95 text-white text-xs sm:text-sm font-semibold px-3 py-2 sm:py-2.5 rounded-xl transition-all"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;