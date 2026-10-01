import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [usn, setUsn] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!year || !section) {
      setError('Please select your year and section.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const result = await login(usn, year, section);

    if (result.success) {
      // Check the returned student object
      const loggedInStudent = JSON.parse(localStorage.getItem('user'));

      if (loggedInStudent?.hasVoted) {
        // If they already voted, send them directly to the results!
        navigate('/results');
      } else {
        // Otherwise, let them vote
        navigate('/ballot');
      }
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative bg-slate-900 px-4 sm:px-6 lg:px-8"
      style={{
        // Background image updated to your provided link
        backgroundImage: "url('https://www.esri.in/en-in/industries/government/elections/overview')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Dark gradient overlay for text readability & focus */}
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[3px]"></div>

      {/* Glassmorphism Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 sm:p-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-500/30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AIML Elections</h1>
          <p className="text-sm text-slate-500 mt-2">Enter your details to access your secure ballot</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2 font-medium">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* USN Input */}
          <div>
            <label htmlFor="usn" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              University Serial Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="usn"
                type="text"
                required
                value={usn}
                onChange={(e) => setUsn(e.target.value.toUpperCase())}
                placeholder="E.G. 1PD22AI001"
                className="w-full pl-10 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono uppercase"
              />
            </div>
          </div>

          {/* Grid for Year & Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="year" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Year
              </label>
              <select
                id="year"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="" disabled>Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div>
              <label htmlFor="section" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Section
              </label>
              <select
                id="section"
                required
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3.5 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="" disabled>Select Section</option>
                <option value="A">Section A</option>
                <option value="B">Section B</option>
                <option value="C">Section C</option>
                <option value="Combined">Combined</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !usn || !year || !section}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Verifying Voter...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Access Ballot
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer / Info */}
      <div className="absolute bottom-6 w-full text-center z-10 pointer-events-none">
        <p className="text-xs text-slate-300 font-medium tracking-wide drop-shadow-md">
          Secured by Department Election Protocol
        </p>
      </div>
    </div>
  );
};

export default Login;