// client/src/components/home/HeroSection.jsx
import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef, useCallback } from "react";
import { ElectionContext } from "../../context/ElectionContext";
import image1 from "../../assets/Election1.jpg";
import image2 from "../../assets/Election2.jpg";
import image3 from "../../assets/Election3.jpg";
import image4 from "../../assets/Election4.jpg";

const SLIDES = [
  { url: image1, caption: "Your vote shapes the future of the nation" },
  { url: image2, caption: "Democracy in action — every voice counts" },
  { url: image3, caption: "Secure, transparent, tamper-proof elections" },
  { url: image4, caption: "Lok Sabha 2026 — Historic general elections" },
];

const TICKER_ITEMS = [
  "🗳️  Lok Sabha Election 2026 — Voting underway in Uttar Pradesh",
  "📊  Live vote counting in progress — Results updating every minute",
  "🏛️  Prayagraj constituency — Polling booths open 7AM to 6PM",
  "✅  Cast your vote securely using SecureVote digital platform",
  "📢  All candidates' manifestos now available — View before you vote",
  "🔒  End-to-end encrypted voting — Your identity stays protected",
  "⚡  Real-time results available on the Results page",
];

const HeroSection = ({ candidates = [] }) => {
  const navigate = useNavigate();
  const { election } = useContext(ElectionContext);
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const intervalRef = useRef(null);

  const totalCandidates = candidates.length;
  const totalConstituencies = new Set(candidates.map((c) => c.constituency)).size;
  const remainingDays = election?.endDate
    ? Math.max(0, Math.ceil((new Date(election.endDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;
 
  const goTo = useCallback((idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 400);
  }, [animating]);

  const next = useCallback(
    () => goTo((current + 1) % SLIDES.length),
    [current, goTo]
  );

  const prev = useCallback(
    () => goTo((current - 1 + SLIDES.length) % SLIDES.length),
    [current, goTo]
  );

  useEffect(() => {
    intervalRef.current = setInterval(next, 4000);
    return () => clearInterval(intervalRef.current);
  }, [next]);

  const resetTimer = useCallback(() => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 4000);
  }, [next]);

  return (
    <section className="rounded-2xl overflow-hidden shadow-lg mt-2">

      {/* ── Scrolling ticker ── */}
      <div className="bg-blue-700 text-white text-xs font-medium py-2 overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-ticker">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="mx-8 flex-shrink-0">{item}</span>
          ))}
        </div>
        <style>{`
          @keyframes ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-ticker {
            animation: ticker 35s linear infinite;
          }
          .animate-ticker:hover {
            animation-play-state: paused;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(1.03); }
            to   { opacity: 1; transform: scale(1); }
          }
          .slide-enter {
            animation: fadeIn 0.5s ease forwards;
          }
        `}</style>
      </div>

      {/* ── Sliding hero image ── */}
      <div className="relative h-[220px] sm:h-[300px] md:h-[360px] bg-gray-900 overflow-hidden">

        <img
          key={current}
          src={SLIDES[current].url}
          alt={SLIDES[current].caption}
          className={`absolute inset-0 w-full h-full object-cover ${animating ? "opacity-0" : "slide-enter"} transition-opacity duration-400`}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/50 to-gray-900/20" />

        {/* Caption + CTA */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {election?.title || "Lok Sabha Election 2026"} — Live
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight max-w-2xl drop-shadow-lg">
            {SLIDES[current].caption}
          </h1>

          <p className="text-sm text-white/70 mb-6 max-w-lg">
            Cast your vote securely · View candidates · Track live results
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate("/cast-vote")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-900/40"
            >
              Cast your vote
            </button>
            <button
              onClick={() => navigate("/candidates")}
              className="bg-white/10 backdrop-blur hover:bg-white/20 border border-white/30 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition"
            >
              View candidates
            </button>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={() => { prev(); resetTimer(); }}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur flex items-center justify-center text-white transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <button
          onClick={() => { next(); resetTimer(); }}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur flex items-center justify-center text-white transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => { goTo(i); resetTimer(); }}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="bg-white border-t border-gray-100 grid grid-cols-3 divide-x divide-gray-100">
        {[
          { value: totalCandidates || "—", label: "Candidates" },
          { value: totalConstituencies || 1, label: "Constituencies" },
          { value: remainingDays > 0 ? `${remainingDays}d left` : "Ended", label: "Voting window" },
        ].map((stat) => (
          <div key={stat.label} className="py-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

    </section>
  );
};

export default HeroSection;