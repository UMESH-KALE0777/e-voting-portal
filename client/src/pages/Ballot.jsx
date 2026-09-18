import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getBallot, submitVote } from '../services/api';

const Ballot = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [candidatesByRole, setCandidatesByRole] = useState({});
    const [selections, setSelections] = useState({}); // { role: candidateId }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitStatus, setSubmitStatus] = useState(''); // 'idle', 'submitting', 'success'

    useEffect(() => {
        const fetchBallot = async () => {
            try {
                const response = await getBallot();
                const candidates = response.data.data;

                // Group candidates by their role (CR, LR, GS, etc.)
                const grouped = candidates.reduce((acc, candidate) => {
                    if (!acc[candidate.role]) acc[candidate.role] = [];
                    acc[candidate.role].push(candidate);
                    return acc;
                }, {});

                setCandidatesByRole(grouped);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load ballot');
                setLoading(false);
            }
        };

        fetchBallot();
    }, []);

    const handleSelect = (role, candidateId) => {
        setSelections(prev => ({ ...prev, [role]: candidateId }));
    };

    const handleSubmit = async () => {
        const selectedIds = Object.values(selections);

        if (selectedIds.length === 0) {
            setError('Please select at least one candidate before submitting.');
            return;
        }

        setSubmitStatus('submitting');
        setError('');

        try {
            await submitVote(selectedIds);
            setSubmitStatus('success');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit vote');
            setSubmitStatus('idle');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-xl font-semibold text-gray-600">Loading your secure ballot...</div>;
    }

    if (submitStatus === 'success') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center border border-green-100">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Vote Submitted!</h2>
                    <p className="text-gray-600 mb-6">Your vote has been securely recorded. Thank you for participating in the AIML Department Elections.</p>
                    <button onClick={handleLogout} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium transition-colors">
                        Log Out securely
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Official Ballot</h1>
                        <p className="text-sm text-gray-500">
                            Voter: {user?.usn} • Year {user?.year} • Sec {user?.section}
                        </p>
                    </div>
                    <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Ballot Content */}
            <main className="max-w-4xl mx-auto px-4 mt-8">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                {Object.keys(candidatesByRole).length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
                        No candidates are currently available for your cohort.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(candidatesByRole).map(([role, candidates]) => (
                            <section key={role} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 uppercase tracking-wider">
                                    Select {role}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {candidates.map((candidate) => (
                                        <label
                                            key={candidate._id}
                                            className={`relative flex items-center p-4 cursor-pointer rounded-lg border-2 transition-all ${selections[role] === candidate._id
                                                ? 'border-blue-600 bg-blue-50'
                                                : 'border-gray-200 hover:border-blue-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={role}
                                                className="sr-only"
                                                onChange={() => handleSelect(role, candidate._id)}
                                                checked={selections[role] === candidate._id}
                                            />
                                            <img
                                                src={candidate.image || 'https://via.placeholder.com/150'}
                                                alt={candidate.name}
                                                className="w-12 h-12 rounded-full object-cover mr-4 bg-gray-200"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{candidate.name}</h3>
                                                <p className="text-xs text-gray-500">Year {candidate.year} • Sec {candidate.section}</p>
                                            </div>

                                            {/* Custom Radio Button Circle */}
                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selections[role] === candidate._id ? 'border-blue-600' : 'border-gray-400'
                                                }`}>
                                                {selections[role] === candidate._id && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}

                {Object.keys(candidatesByRole).length > 0 && (
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSubmit}
                            disabled={submitStatus === 'submitting'}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
                        >
                            {submitStatus === 'submitting' ? 'Submitting Vote...' : 'Cast My Vote'}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Ballot;