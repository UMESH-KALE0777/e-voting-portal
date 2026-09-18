// client/src/pages/ElectionStatus.jsx
import { useEffect, useState, useContext } from "react";
import api from "../utils/api"; 
import { ElectionContext } from "../context/ElectionContext"; 

const ElectionStatus = () => {
  const { election } = useContext(ElectionContext); 
  const [totalVotes, setTotalVotes] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [ended, setEnded] = useState(false);
  const [statsError, setStatsError] = useState(false);

  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/votes/stats");
        setTotalVotes(data.totalVotes);
      } catch (err) {
        console.error("Failed to fetch stats", err);
        setStatsError(true);
      }
    };
    fetchStats();
  }, []);

 
  useEffect(() => {
    const ELECTION_END = election?.endDate ? new Date(election.endDate) : null;

    if (!ELECTION_END) return; 

     
    if (ELECTION_END - new Date() <= 0) {
      setEnded(true);
      return;  
    }

    const calc = () => {
      const diff = ELECTION_END - new Date();
      if (diff <= 0) {
        setEnded(true);
        clearInterval(interval);  
        return;
      }
      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [election?.endDate]); 

  const pad = (n) => String(n ?? 0).padStart(2, "0");

 
  const fmt = (dateStr) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : "TBD";

  const now = new Date();
  const startDate = election?.startDate ? new Date(election.startDate) : null;
  const endDate   = election?.endDate   ? new Date(election.endDate)   : null;

  const timeline = [
    { label: "Nominations closed",  date: fmt(election?.nominationEndDate), done: true },
    { label: "Campaign period ended",date: fmt(election?.campaignEndDate),   done: startDate ? now >= startDate : false },
    { label: "Voting started",       date: fmt(election?.startDate),          done: startDate ? now >= startDate : false },
    { label: "Voting ends",          date: fmt(election?.endDate),            done: ended },
    { label: "Results declared",     date: fmt(election?.resultsDate),        done: ended },
  ];

  const cards = [
    {
      label: "Election status",
      value: ended ? "Closed" : "Live",
      color: ended ? "text-red-600" : "text-green-600",
      bg:    ended ? "bg-red-50"    : "bg-green-50",
      dot:   ended ? "bg-red-500"   : "bg-green-500",
      icon: "🗳️",
    },
    {
      label: "Total votes",
      value: statsError
        ? "Unavailable"
        : totalVotes === null
        ? "Loading..."
        : totalVotes.toLocaleString(),
      color: "text-blue-700",
      bg:    "bg-blue-50",
      dot:   "bg-blue-500",
      icon: "✅",
    },
    {
      label: "Time remaining",
      value: ended
        ? "Voting ended"
        : !election
        ? "Loading..."
        : `${pad(timeLeft.d)}d : ${pad(timeLeft.h)}h : ${pad(timeLeft.m)}m : ${pad(timeLeft.s)}s`,
      color: ended ? "text-red-500" : "text-purple-700",
      bg:    "bg-purple-50",
      dot:   ended ? "bg-red-500" : "bg-purple-500",
      icon: "⏳",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4">

      {/* Header */}
      <div className="text-center mb-7 sm:mb-10">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-medium mb-4">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          Live Election Tracking
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Election Status Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          {election?.title || "India General Election 2026"} · {election?.state || "Uttar Pradesh"}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl sm:rounded-2xl ${card.bg} flex items-center justify-center text-xl`}>
                {card.icon}
              </div>
              <div className={`w-2.5 h-2.5 rounded-full ${card.dot} ${!ended ? "animate-pulse" : ""}`} />
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mb-1.5">{card.label}</p>
            
            <p className={`text-xl sm:text-2xl font-bold ${card.color} break-words`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5 sm:mb-6">
           
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Election Timeline</h2>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live updates
          </div>
        </div>

        <div className="space-y-3">
          {timeline.map(({ label, date, done }, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-3 sm:py-4 transition gap-3"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm
                  ${done ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-400"}`}>
                  {done ? "✓" : "•"}
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${done ? "text-gray-900" : "text-gray-400"}`}>
                    {label}
                  </p>
                  <p className="text-xs text-gray-400">{done ? "Completed" : "Pending"}</p>
                </div>
              </div>
               
              <p className="text-xs sm:text-sm text-gray-400 flex-shrink-0">{date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ElectionStatus;