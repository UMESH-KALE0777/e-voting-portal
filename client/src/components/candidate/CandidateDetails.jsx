const getInitials = (name) =>
  name?.split(" ").map((n) => n[0]).join("").toUpperCase();

const CandidateDetails = ({ candidate }) => {
  const goals = candidate.manifesto?.split(",") || [];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">

      {/* Header */}
      <div className="bg-blue-700 px-4 sm:px-6 py-6 sm:py-10 text-center">
        <div className="relative inline-block mb-3 sm:mb-4">
          {candidate.image ? (
            <img
              src={`http://localhost:5000/uploads/candidates/${candidate.image}`}
              alt={candidate.name}
              className="w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white/30 mx-auto"
            />
          ) : (
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white mx-auto">
              {getInitials(candidate.name)}
            </div>
          )}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">{candidate.name}</h1>
        <p className="text-blue-200 text-xs sm:text-sm mb-3">{candidate.party}</p>
        <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
          <svg className="w-3 h-3 text-blue-200" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="text-xs text-blue-200">{candidate.constituency}</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: "Age", value: `${candidate.age} yrs` },
            { label: "Experience", value: candidate.experience },
            { label: "Education", value: candidate.education },
          ].map((s) => (
            <div key={s.label} className="bg-gray-50 rounded-xl p-2 sm:p-3 text-center">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Manifesto */}
        <div className="border border-gray-100 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Manifesto</p>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{candidate.manifesto}</p>
        </div>

        {/* Goals */}
        <div className="border border-gray-100 rounded-xl p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-900">Development goals</p>
          </div>
          <div className="space-y-2">
            {goals.map((goal, i) => (
              <div key={i} className="flex items-center gap-2 sm:gap-3 bg-gray-50 hover:bg-blue-50 rounded-lg px-2.5 sm:px-3 py-2 transition">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-gray-700">{goal.trim()}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CandidateDetails;