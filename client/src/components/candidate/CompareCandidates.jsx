// client/src/components/candidate/CompareCandidates.jsx
const CompareCandidates = ({ candidates = [] }) => {
  if (candidates.length < 2) return null;

  const rows = [
    { label: "Party", key: "party" },
    { label: "Age", key: "age", suffix: " yrs" },
    { label: "Education", key: "education" },
    { label: "Experience", key: "experience" },
    { label: "Constituency", key: "constituency" },
    { label: "Total Votes", key: "totalVotes" },
  ];

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase();

  return (
    <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">

      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-900">Compare candidates</p>
        <p className="text-xs text-gray-400 mt-0.5">Side by side comparison</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="px-5 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-32">
                Field
              </th>
              {candidates.map((c, i) => (
                <th key={c._id} className="px-5 py-3 text-center">
                  <div className="flex flex-col items-center gap-2">
                    {c.image ? (
                      <img
                        src={`http://localhost:5000/uploads/candidates/${c.image}`}
                        alt={c.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-800 text-sm font-bold flex items-center justify-center">
                        {getInitials(c.name)}
                      </div>
                    )}
                    <p className="text-xs font-semibold text-gray-900">{c.name}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr key={row.label} className="hover:bg-gray-50 transition">
                <td className="px-5 py-3 text-xs font-medium text-gray-500">{row.label}</td>
                {candidates.map((c) => (
                  <td key={c._id} className="px-5 py-3 text-sm text-gray-900 text-center">
                    {c[row.key]}{row.suffix || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CompareCandidates;