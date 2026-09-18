// client/src/components/home/ElectionTypes.jsx
const types = [
  {
    title: "Lok Sabha election",
    desc: "National parliamentary elections conducted to elect representatives for the central government of India.",
    icon: (
      <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21" />
      </svg>
    ),
  },
  {
    title: "Assembly election",
    desc: "State-level elections held to elect representatives responsible for forming state governments across India.",
    icon: (
      <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
  },
  {
    title: "Municipal election",
    desc: "Local governance elections conducted for municipal corporations and city administration bodies.",
    icon: (
      <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  },
];

const ElectionTypes = () => {
  return (
    <section>
      <div className="text-center mb-8">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
          Supported elections
        </p>
        <h2 className="text-xl font-semibold text-gray-900">Election types</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
          SecureVote supports different types of democratic elections including
          national, state, and local governance elections.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {types.map((type) => (
          <div
            key={type.title}
            className="bg-white border border-gray-100 rounded-2xl p-6"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
              {type.icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              {type.title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">{type.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ElectionTypes;