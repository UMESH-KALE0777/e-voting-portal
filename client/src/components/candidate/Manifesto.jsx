const Manifesto = ({ manifesto = "", name = "" }) => {
  const points = manifesto.split(",").map((p) => p.trim()).filter(Boolean);

  if (!manifesto) return null;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-50 rounded-lg flex items-center justify-center">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {name ? `${name}'s Manifesto` : "Candidate Manifesto"}
          </p>
          <p className="text-xs text-gray-400">Key promises & commitments</p>
        </div>
      </div>
      <div className="space-y-2">
        {points.map((point, i) => (
          <div key={i} className="flex items-start gap-2 sm:gap-3 bg-gray-50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
              {i + 1}
            </div>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Manifesto;