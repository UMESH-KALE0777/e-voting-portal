import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import './Ballot.css';

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
                const response = await API.get('/voting/ballot');
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

    useEffect(() => {
        if (submitStatus === 'success') {
            const timer = setTimeout(() => {
                logout();
                navigate('/login');
            }, 3000); // 3000 milliseconds = 3 seconds

            return () => clearTimeout(timer);
        }
    }, [submitStatus, logout, navigate]);

    if (user?.hasVoted) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
                <p className="text-gray-600 mb-6">Your vote has already been securely recorded. You cannot vote twice.</p>
                <button
                    onClick={() => navigate('/results')}
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg font-medium"
                >
                    View Live Results
                </button>
            </div>
        );
    }

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
            await API.post('/voting/submit', { selectedCandidateIds: selectedIds });
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
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Vote Securely Recorded!</h2>
                    <p className="text-gray-600 mb-6">Thank you for voting. Please step away for the next voter.</p>
                    <div className="flex items-center justify-center text-sm text-gray-400">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Resetting system securely...
                    </div>
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
                            Voter: {user?.usn} | Year {user?.year} | Sec {user?.section}
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

                                {/* Candidate Cards from 2nd Image */}
                                <div className="candidate-cards-grid">
                                    {candidates.map((candidate) => {
                                        const isSelected = selections[role] === candidate._id;
                                        return (
                                            <div
                                                key={candidate._id}
                                                onClick={() => handleSelect(role, candidate._id)}
                                                className={`candidate-card ${isSelected ? 'is-selected' : ''}`}
                                            >
                                                {/* Profile Picture */}
                                                <div className="profile-pic">
                                                    <img
                                                        src={candidate.image || 'https://via.placeholder.com/150'}
                                                        alt={candidate.name}
                                                    />
                                                </div>

                                                {/* Bottom Sheet */}
                                                <div className="bottom">
                                                    <div className="content">
                                                        <span className="name">{candidate.name}</span>
                                                        <span className="about-me">
                                                            Year {candidate.year} | Sec {candidate.section}
                                                        </span>
                                                    </div>

                                                    <div className="bottom-bottom">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleSelect(role, candidate._id);
                                                            }}
                                                            className="cast-vote-btn"
                                                        >
                                                            {isSelected ? '✓ Vote Selected' : 'Cast My Vote'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
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