// client/src/components/home/ElectionInfo.jsx
import { useContext } from "react";
import { ElectionContext } from "../../context/ElectionContext";
  const ElectionInfo = () => {
  const { election } = useContext(ElectionContext);
  const now = new Date();
  const start = election?.startDate ? new Date(election.startDate) : null;
  const end = election?.endDate ? new Date(election.endDate) : null;

  const isLive = start && end && now >= start && now <= end;
  const isEnded = end && now > end;
  const isUpcoming = start && now < start;

  const statusLabel = isLive
    ? "Live counting"
    : isEnded
      ? "Voting closed"
      : isUpcoming
        ? "Upcoming"
        : "Not started";

  const statusColor = isLive
    ? "text-green-600"
    : isEnded
      ? "text-red-600"
      : "text-amber-600";

  const statusBg = isLive
    ? "bg-green-50"
    : isEnded
      ? "bg-red-50"
      : "bg-amber-50";

  const statusDot = isLive
    ? "bg-green-500"
    : isEnded
      ? "bg-red-500"
      : "bg-amber-500";

 
  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const info = [
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
      label: "Election type",
      value: election?.type || "Lok Sabha Election",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      label: "State",
      value: election?.state || "Uttar Pradesh",
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      ),
      label: "Constituency",
      value: election?.constituency || "Prayagraj",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
        </svg>
      ),
      label: "Voting start",
      value: formatDate(election?.startDate), 
      color: "bg-green-50 text-green-600",
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Voting end",
      value: formatDate(election?.endDate), 
      color: "bg-red-50 text-red-500",
    },
  ];

  return (
    <section>
      <div className="text-center mb-6">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
          Official info
        </p>
        <h2 className="text-xl font-semibold text-gray-900">Election information</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {info.map((item) => (
          <div
            key={item.label}
            className="bg-white border border-gray-100 rounded-2xl px-4 py-4 flex items-start gap-3 hover:shadow-sm transition"
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 truncate">{item.label}</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{item.value}</p>
            </div>
          </div>
        ))}

         
        <div className="bg-white border border-gray-100 rounded-2xl px-4 py-4 flex items-start gap-3 hover:shadow-sm transition">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${statusBg}`}>
            <span className={`w-2.5 h-2.5 rounded-full block ${statusDot} ${isLive ? "animate-pulse" : ""}`} />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
            <p className={`text-sm font-semibold ${statusColor}`}>{statusLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ElectionInfo;