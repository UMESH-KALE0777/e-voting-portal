// client/src/components/voting/VotingInstructions.jsx

const instructions = [
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    text: "Verify candidate details carefully before voting.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    text: "Each voter can cast only one vote.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    text: "Once submitted, the vote cannot be changed.",
    color: "bg-red-50 text-red-500",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
      </svg>
    ),
    text: "Your vote remains private and secure at all times.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm9.75-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v10.125c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V9.75zm-9.75 3.375" />
      </svg>
    ),
    text: "Results will be announced only after the election ends.",
    color: "bg-amber-50 text-amber-600",
  },
];

const VotingInstructions = () => {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
      <div className="mb-5">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-1">
          Before you vote
        </p>
       
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Voting instructions</h2>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {instructions.map((item, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.color}`}>
              {item.icon}
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pt-1">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VotingInstructions;