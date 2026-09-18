// client/src/components/navbar/CountdownTimer.jsx
import { useEffect, useState, useContext } from "react";
import { ElectionContext } from "../../context/ElectionContext";

const CountdownTimer = () => {
  const { election } = useContext(ElectionContext);
  const [timeLeft, setTimeLeft] = useState({});
  const [status, setStatus] = useState("loading");

  const getDiff = (diff) => ({
    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
    m: Math.floor((diff / (1000 * 60)) % 60),
    s: Math.floor((diff / 1000) % 60),
  });

  useEffect(() => {
    if (!election) {
      setStatus("no-election");
      return;
    }

    const calc = () => {
      const now = new Date();
      const start = new Date(election.startDate);
      const end = new Date(election.endDate);

      if (now < start) {
        setStatus("upcoming");
        setTimeLeft(getDiff(start - now));
      } else if (now <= end) {
        setStatus("live");
        setTimeLeft(getDiff(end - now));
      } else {
        setStatus("ended");
      }
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [election]);

  const pad = (n) => String(n ?? 0).padStart(2, "0");

  if (status === "loading" || status === "no-election") return null;

  if (status === "ended") return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-1.5 rounded-lg text-xs font-medium">
      Voting Closed
    </div>
  );

  return (
    <div className={`border px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5
      ${status === "live"
        ? "bg-green-50 border-green-200 text-green-800"
        : "bg-yellow-50 border-yellow-200 text-yellow-800"}`}>
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        {status === "upcoming" ? "Starts in · " : ""}
        {pad(timeLeft.d)}d : {pad(timeLeft.h)}h : {pad(timeLeft.m)}m : {pad(timeLeft.s)}s
      </span>
    </div>
  );
};

export default CountdownTimer;