import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResults } from '../services/api';

const Results = () => {
  const [candidatesByRole, setCandidatesByRole] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const loadResults = () => {
      getResults()
        .then((response) => {
          if (isMounted) {
            const candidates = response.data.data || [];
            const grouped = candidates.reduce((acc, candidate) => {
              if (!acc[candidate.role]) acc[candidate.role] = [];
              acc[candidate.role].push(candidate);
              return acc;
            }, {});
            setCandidatesByRole(grouped);
            setLoading(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setError('Failed to load election results. Please try again.');
            setLoading(false);
          }
        });
    };

    loadResults();
    const interval = setInterval(loadResults, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-lg font-medium">Loading election results...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-16 selection:bg-blue-500 selection:text-white">
      <header className="bg-slate-900 border-b border-slate-800 shadow-xl py-6 mb-8">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
              ALPHA NEURON ELECTIONS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Live Election Results</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">Real-time election tabulation</p>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors cursor-pointer"
          >
            Back to Login
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-center mb-6 text-sm">
            {error}
          </div>
        )}

        {Object.keys(candidatesByRole).length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400">
            No election results available yet.
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(candidatesByRole).map(([role, candidates]) => {
              const totalVotesForRole = candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0);

              return (
                <section key={role} className="bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
                    <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      {role}
                    </h2>
                    <span className="text-xs text-slate-400">
                      Total Votes: <strong className="text-slate-200">{totalVotesForRole}</strong>
                    </span>
                  </div>

                  <div className="space-y-4">
                    {candidates.map((candidate) => {
                      const percentage = totalVotesForRole === 0 
                        ? 0 
                        : Math.round(((candidate.voteCount || 0) / totalVotesForRole) * 100);

                      return (
                        <div key={candidate._id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                          <div className="flex justify-between items-center mb-2 gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              {candidate.image ? (
                                <img 
                                  src={candidate.image} 
                                  alt={candidate.name} 
                                  className="w-10 h-10 rounded-full object-cover border border-slate-700 flex-shrink-0"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-slate-300 flex-shrink-0">
                                  {candidate.name.charAt(0)}
                                </div>
                              )}
                              <div className="truncate">
                                <div className="font-semibold text-white truncate">{candidate.name}</div>
                                <div className="text-xs text-slate-400">
                                  Year {candidate.year} • Section {candidate.section}
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <span className="font-bold text-lg text-blue-400">{candidate.voteCount || 0}</span>
                              <span className="text-xs text-slate-400 ml-1.5">({percentage}%)</span>
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-blue-600 to-cyan-400 h-2 rounded-full transition-all duration-700 ease-out" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Results;