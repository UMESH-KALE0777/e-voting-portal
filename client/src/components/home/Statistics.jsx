// client/src/components/home/Statistics.jsx
import { useEffect, useState, useContext } from "react";
import { ElectionContext } from "../../context/ElectionContext";
import StatCard from "../stats/StatCard";
import BottomStats from "../stats/BottomStats";
import api from "../../utils/api";

const Statistics = () => {
  const { election } = useContext(ElectionContext);
  const [stats, setStats] = useState({
    totalVoters: 0,
    totalVotes: 0,
    totalCandidates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [candidatesRes, votesRes] = await Promise.all([
          api.get("/candidates"), 
          api.get("/votes/stats"),
        ]);
        setStats({
          totalCandidates: candidatesRes.data?.length || 0,
          totalVotes: votesRes.data?.totalVotes || 0,
          totalVoters: votesRes.data?.totalVoters || 0,
        });
      } catch (err) {
        console.error("Stats fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const turnout = stats.totalVoters
    ? Math.round((stats.totalVotes / stats.totalVoters) * 100)
    : 0;

  const remainingDays = election?.endDate
    ? Math.max(
        0,
        Math.ceil((new Date(election.endDate) - new Date()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  const cards = [
    {
      label: "Registered voters",
      value: loading ? "..." : stats.totalVoters.toLocaleString() + "+",
      bar: 100,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-700",
      barColor: "bg-blue-700",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: "Votes cast",
      value: loading ? "..." : stats.totalVotes.toLocaleString() + "+",
      bar: turnout,
      iconBg: "bg-green-50",
      iconColor: "text-green-700",
      barColor: "bg-green-700",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "Voter turnout",
      value: loading ? "..." : turnout + "%",
      bar: turnout,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-700",
      barColor: "bg-amber-600",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" />
        </svg>
      ),
    },
  ];

  return (
    <section>
      <div className="text-center mb-8">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
          Live updates
        </p>
        <h2 className="text-xl font-semibold text-gray-900">Election statistics</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <BottomStats
        totalCandidates={stats.totalCandidates}
        remainingDays={remainingDays}
      />

      <div className="flex items-center justify-center gap-2 mt-4">
        <div className={`w-2 h-2 rounded-full ${loading ? "bg-gray-300" : "bg-green-500"}`} />
        <p className="text-xs text-gray-400">
          {loading ? "Fetching live data..." : "Live data · Last updated just now"}
        </p>
      </div>
    </section>
  );
};

export default Statistics;