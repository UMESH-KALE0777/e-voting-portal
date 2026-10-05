import { useState, useEffect } from 'react';
import { getResults } from '../services/api';

const Results = () => {
  const [candidatesByRole, setCandidatesByRole] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResults = async () => {
    try {
      const response = await getResults();
      const candidates = response.data.data;
      
      // Group by role for display
      const grouped = candidates.reduce((acc, candidate) => {
        if (!acc[candidate.role]) acc[candidate.role] = [];
        acc[candidate.role].push(candidate);
        return acc;
      }, {});
      
      setCandidatesByRole(grouped);
      setLoading(false);
    } catch (err) {
      setError('Failed to load results');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // Optional: Refresh results every 10 seconds for a "live" feel
    const interval = setInterval(fetchResults, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Results...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <header className="bg-blue-900 text-white shadow-md py-6 mb-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-800/80 text-blue-200 border border-blue-700 uppercase tracking-wider">
            ALPHA NEURON ELECTIONS
          </span>
          <h1 className="text-3xl font-bold mt-2">Live Election Results</h1>
          <p className="text-blue-200 mt-1">ALPHA NEURON ELECTIONS • 2026</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4">
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <div className="space-y-8">
          {Object.entries(candidatesByRole).map(([role, candidates]) => {
            // Calculate total votes for this role to determine percentages
            const totalVotesForRole = candidates.reduce((sum, c) => sum + c.voteCount, 0);

            return (
              <section key={role} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
                  Role: {role}
                </h2>
                
                <div className="space-y-6">
                  {candidates.map((candidate) => {
                    const percentage = totalVotesForRole === 0 
                      ? 0 
                      : Math.round((candidate.voteCount / totalVotesForRole) * 100);

                    return (
                      <div key={candidate._id}>
                        <div className="flex justify-between items-end mb-2">
                          <div className="flex items-center">
                            <img 
                              src={candidate.image || 'https://via.placeholder.com/150'} 
                              alt={candidate.name} 
                              className="w-10 h-10 rounded-full mr-3 border border-gray-200"
                            />
                            <div>
                              <span className="font-semibold text-gray-900">{candidate.name}</span>
                              <span className="text-xs text-gray-500 ml-2">(Yr {candidate.year}, Sec {candidate.section})</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-lg text-blue-600">{candidate.voteCount}</span>
                            <span className="text-sm text-gray-500 ml-1">votes ({percentage}%)</span>
                          </div>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
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
      </main>
    </div>
  );
};

export default Results;