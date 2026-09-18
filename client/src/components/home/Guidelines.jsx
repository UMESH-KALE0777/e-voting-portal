// client/src/components/home/Guidelines.jsx
 const guidelines = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "One vote per voter",
    desc: "Each registered voter is allowed to cast exactly one vote. Duplicate voting is blocked by the system.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: "Votes are private",
    desc: "Your vote is encrypted end-to-end. No one, including admins, can see who you voted for.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm9.75-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v10.125c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V9.75zm-9.75 3.375" />
      </svg>
    ),
    title: "Results after voting ends",
    desc: "Final results are published only after the voting window closes to prevent influence.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
    title: "Blockchain transparency",
    desc: "Votes are recorded on an immutable ledger ensuring every vote is verifiable and tamper-proof.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "Identity is confidential",
    desc: "Voter identity remains confidential at all times. Only authentication tokens are used during the process.",
    color: "bg-pink-50 text-pink-600",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    title: "No tampering allowed",
    desc: "Any attempt to tamper with votes or access the system unauthorisedly triggers security alerts.",
    color: "bg-red-50 text-red-500",
  },
];

const Guidelines = () => {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 md:p-8">

      <div className="text-center mb-6">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
          How it works
        </p>
        <h2 className="text-xl font-semibold text-gray-900">Election guidelines</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-xl mx-auto">
          SecureVote follows strict guidelines to ensure a fair, transparent, and tamper-proof election process.
        </p>
      </div>

       
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {guidelines.map((g) => (
          <div
            key={g.title}
            className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 hover:shadow-sm transition"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${g.color}`}>
              {g.icon}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">{g.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{g.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Guidelines;