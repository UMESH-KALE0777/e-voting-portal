import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import './Ballot.css';

// Global lock to prevent multiple submissions
let isVoteAnimationPlaying = false;

function showVoteSuccessAnimation(onCompleteCallback) {
    if (isVoteAnimationPlaying) return;
    isVoteAnimationPlaying = true;

    // Get DOM elements
    const overlay = document.getElementById('vote-animation-overlay');
    const scene = document.getElementById('vote-scene');
    const ballot = document.getElementById('ballot-paper');
    const box = document.getElementById('ballot-box');
    const successMsg = document.getElementById('vote-success-message');

    if (!overlay || !scene || !ballot || !box || !successMsg) {
        if (onCompleteCallback) onCompleteCallback();
        return;
    }

    // 1. Reset all states before starting
    gsap.set(overlay, { opacity: 0, pointerEvents: 'all' });
    gsap.set(scene, { display: 'flex', opacity: 1, scale: 1 });
    gsap.set(box, { scale: 0.8, y: 30, opacity: 0 });
    gsap.set(ballot, { y: -150, rotation: -15, opacity: 0 }); // Starts high and rotated
    gsap.set(successMsg, { display: 'none', opacity: 0, scale: 0.8 });

    // 2. Build the GSAP Timeline
    const tl = gsap.timeline({
        onComplete: () => {
            // Hold the success message for 1.5s, then fade out the whole overlay
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.5,
                delay: 1.5,
                onComplete: () => {
                    overlay.style.pointerEvents = 'none';
                    isVoteAnimationPlaying = false;
                    if (onCompleteCallback) {
                        onCompleteCallback();
                    }
                }
            });
        }
    });

    tl.to(overlay, { opacity: 1, duration: 0.3 })
        // Step 1: Voting box smoothly pops up
        .to(box, { scale: 1, y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.2)' })

        // Step 2: Ballot appears and floats above the box
        .to(ballot, { opacity: 1, y: -90, rotation: 5, duration: 0.4, ease: 'power2.out' })

        // Step 3: Ballot arcs down into the slot
        .to(ballot, {
            y: 35, // Moves down deep enough to hide behind the front layer
            rotation: 0,
            duration: 0.8,
            ease: 'power2.inOut'
        })

        // Step 4: The whole box/ballot scene scales down and fades out
        .to(scene, { scale: 0.8, opacity: 0, duration: 0.3, ease: 'power2.in' }, '+=0.2')

        // Step 5: Swap visibility and pop in the success message
        .set(scene, { display: 'none' })
        .set(successMsg, { display: 'block' })
        .to(successMsg, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' });
}

const Ballot = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [candidatesByRole, setCandidatesByRole] = useState({});
    const [selections, setSelections] = useState({}); // { role: candidateId }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle', 'submitting', 'submitted'

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
        if (isVoteAnimationPlaying) return;

        const selectedIds = Object.values(selections);

        if (selectedIds.length === 0) {
            setError('Please select at least one candidate before submitting.');
            return;
        }

        setSubmitStatus('submitting');
        setError('');

        try {
            await API.post('/voting/submit', { selectedCandidateIds: selectedIds });
            setSubmitStatus('submitted');
            showVoteSuccessAnimation(() => {
                logout();
                navigate('/login');
            });
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

    return (
        <div className="min-h-screen bg-gray-50 pb-12 relative">
            {/* GSAP Full-Screen Animation Overlay */}
            <div id="vote-animation-overlay">
                <div id="vote-scene">
                    <div id="ballot-paper">
                        <div className="ballot-line"></div>
                        <div className="ballot-line short"></div>
                        <div className="ballot-check">✓</div>
                    </div>
                    <div id="ballot-box">
                        <div className="box-back"></div>
                        <div className="box-front">
                            <svg
                                className="box-logo"
                                viewBox="-1 -0.9968924522399902 26.000001907348633 26.000001907348633"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                <div id="vote-success-message">
                    <div className="success-icon">
                        <svg viewBox="-0.5900001525878906 1.5900001525878906 25.59000015258789 21.40999984741211" fill="white">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
                        </svg>
                    </div>
                    <h2>Vote Cast Successfully</h2>
                    <p>Your vote has been recorded.</p>
                </div>
            </div>
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