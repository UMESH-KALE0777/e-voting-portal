// client/src/components/results/WinnerBanner.jsx
import { IoMdTrophy } from "react-icons/io";

 
const WinnerBanner = ({ winnerName, party, constituency, totalVotes }) => {
  return (
    <section className="bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10 text-center">

      {/* Trophy */}
      <div className="flex items-center justify-center mb-4 sm:mb-6">
         
        <IoMdTrophy
          size={64}
          className="text-yellow-300 drop-shadow-lg sm:!w-20 sm:!h-20"
        />
      </div>

      {/* Winner label */}
      <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 sm:mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
        Election Winner Declared
      </div>

       
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
        {winnerName}
      </h2>

      <p className="text-base sm:text-lg md:text-xl font-medium text-white/90 mb-1">
        {party}
      </p>

      {constituency && (
        <p className="text-sm text-white/70 mb-4 sm:mb-5">{constituency} constituency</p>
      )}

      {/* Stats row */}
      <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 mt-1">
        <svg className="w-4 h-4 text-white/80 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm sm:text-base text-white/90">
          Total votes:{" "}
          <span className="font-bold text-white">
            {typeof totalVotes === "number" ? totalVotes.toLocaleString() : totalVotes}
          </span>
        </span>
      </div>
    </section>
  );
};

export default WinnerBanner;