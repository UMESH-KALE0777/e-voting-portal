import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [usn, setUsn] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usn.trim()) {
      setError('Please enter your University Serial Number.');
      return;
    }

    if (!year || !section) {
      setError('Please select both your Year and Section.');
      return;
    }

    setError('');
    // Trigger the voting terminal animation on button click
    setIsAnimating(true);
    setIsSubmitting(true);

    try {
      // Allow the card animation (~1350ms) to play fully before proceeding
      const [result] = await Promise.all([
        login(usn.trim().toUpperCase(), year, section),
        new Promise((resolve) => setTimeout(resolve, 1350)),
      ]);

      if (result.success) {
        const loggedInStudent = JSON.parse(localStorage.getItem('user'));

        if (loggedInStudent?.hasVoted) {
          navigate('/results');
        } else {
          navigate('/ballot');
        }
      } else {
        setError(result.message || 'Authentication failed. Please verify your credentials or ensure the server is active.');
        setIsSubmitting(false);
        setIsAnimating(false);
      }
    } catch {
      setError('Connection to election server failed. Please ensure the backend is running.');
      setIsSubmitting(false);
      setIsAnimating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-black px-4 sm:px-6 lg:px-8 py-10 selection:bg-sky-500 selection:text-white overflow-hidden">
      {/* Main Alert Login Container */}
      <div className={`login-alert-container ${isAnimating ? 'is-animating' : ''}`}>
        
        {/* Left Side: Card Animation */}
        <div className="login-left-side select-none">
          {/* Machine Animation Stage (Exact reproduction of alert card slot) */}
          <div className="machine-stage-wrapper">
            <div className="machine-stage">
              {/* Voter ID Card */}
              <div className="machine-card">
                <div className="machine-card-line" />
                <div className="machine-buttons" />
              </div>

              {/* Emerging Ballot Receipt / Ticket */}
              <div className="machine-post">
                <div className="machine-post-line" />
                <div className="machine-screen">
                  <div className="machine-icon">!</div>
                </div>
                <div className="machine-numbers" />
                <div className="machine-numbers-line2" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Large Login Window in New Alert Space */}
        <div className="login-right-side">

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              ALPHA NEURON ELECTIONS
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                2026
              </span>
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Enter your credentials to authenticate and access your official ballot.
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2.5 font-medium animate-shake">
              <svg className="w-5 h-5 shrink-0 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* USN Input */}
            <div>
              <label htmlFor="usn" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                University Serial Number (USN)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="w-full pl-10 pr-4 py-3 bg-white/90 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 transition-all font-mono uppercase shadow-sm"
                />
              </div>
            </div>

            {/* Year & Section Row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label htmlFor="year" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Year
                </label>
                <select
                  id="year"
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3.5 py-3 bg-white/90 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 transition-all cursor-pointer shadow-sm"
                >
                  <option value="" disabled>Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div>
                <label htmlFor="section" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Section
                </label>
                <select
                  id="section"
                  required
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3.5 py-3 bg-white/90 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/25 focus:border-sky-500 transition-all cursor-pointer shadow-sm"
                >
                  <option value="" disabled>Select Section</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="Combined">Combined</option>
                </select>
              </div>
            </div>

            {/* Access Ballot Button with Gradient matching Card styling */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative group overflow-hidden flex items-center justify-center gap-2.5 text-white font-semibold py-3.5 px-6 rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-sky-500/35 hover:shadow-lg active:scale-[0.99] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                style={{
                  background: 'linear-gradient(-45deg, rgb(0, 153, 255) 0%, cyan 100%)'
                }}
              >
                {/* Subtle highlight sheen */}
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Reading Smart Card &amp; Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Access Ballot</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>Encrypted Voting Protocol</span>
            <span className="font-mono text-sky-700/80">Secured • One Vote Per USN</span>
          </div>
        </div>

      </div>

      {/* Footer Info */}
      <div className="absolute bottom-4 w-full text-center z-10 pointer-events-none">
        <p className="text-xs text-slate-400/80 font-medium tracking-wide">
          ALPHA NEURON ELECTIONS • Dept. of AI &amp; Machine Learning
        </p>
      </div>
    </div>
  );
};

export default Login;