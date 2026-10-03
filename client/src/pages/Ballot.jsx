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
    const card = document.getElementById('vote-modal-card');
    const paper = document.getElementById('ballot-paper');
    const boxBack = document.getElementById('ballot-box-back');
    const boxFront = document.getElementById('ballot-box-front');
    const badge = document.getElementById('box-badge');
    const successMsg = document.getElementById('vote-success-message');

    if (!overlay || !card || !paper || !boxBack || !boxFront || !badge || !successMsg) {
        if (onCompleteCallback) onCompleteCallback();
        return;
    }

    // 1. Reset all states before starting
    gsap.set(overlay, { opacity: 0, pointerEvents: 'all' });
    gsap.set(card, { scale: 0.88, opacity: 0 });
    gsap.set(paper, { y: -115, opacity: 0 }); // Image 1 resting spot right above slot
    gsap.set([boxBack, boxFront], { y: 0 });
    gsap.set(badge, { scale: 1 });
    gsap.set(successMsg, { opacity: 0, y: 10 });

    // 2. Build the GSAP Timeline
    const tl = gsap.timeline({
        onComplete: () => {
            // Hold the success message for 1.8s, then smoothly fade out
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.4,
                delay: 1.8,
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

    tl.to(overlay, { opacity: 1, duration: 0.25 })
        // Step 1: White modal card pops in with smooth back ease
        .to(card, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.2)' }, '-=0.1')
        // Ballot paper appears right above the slot (Image 1 state)
        .to(paper, { opacity: 1, duration: 0.2 }, '-=0.15')
        // Brief pause at Image 1 position so voter clearly recognizes the ballot
        .to({}, { duration: 0.25 })
        // Step 2: Ballot paper slides straight down into the slot (through Image 2 into box)
        .to(paper, {
            y: 25, // Slides fully into the box under the front lip
            duration: 0.85,
            ease: 'power2.inOut'
        })
        .set(paper, { opacity: 0 })
        // Step 3: Box bounces gently upon receiving the ballot, and the blue badge pops
        .to([boxBack, boxFront], { y: 4, duration: 0.1, yoyo: true, repeat: 1, ease: 'power1.inOut' })
        .to(badge, { scale: 1.25, duration: 0.25, ease: 'back.out(2)' }, '-=0.1')
        .to(badge, { scale: 1, duration: 0.2, ease: 'power1.out' })
        // Step 4: Success confirmation text pops in
        .to(successMsg, { opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.4)' }, '-=0.1');
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
                <div id="vote-modal-card">
                    <div id="vote-scene">
                        {/* Box Back Layer: Lid and Slot (z-index: 1) */}
                        <div id="ballot-box-back">
                            <div className="box-lid-back">
                                <div className="box-slot-hole"></div>
                            </div>
                            <div className="box-body-back"></div>
                        </div>

                        {/* Ballot Paper (z-index: 2 - sits between box back and box front) */}
                        <div id="ballot-paper">
                            <div className="ballot-paper-header"></div>
                            <div className="ballot-paper-body">
                                <div className="ballot-checkbox-row">
                                    <div className="ballot-checkbox">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="6 12 10 16 18 8" />
                                        </svg>
                                    </div>
                                    <div className="ballot-line-title"></div>
                                </div>
                                <div className="ballot-line l1"></div>
                                <div className="ballot-line l2"></div>
                                <div className="ballot-line l3"></div>
                            </div>
                        </div>

                        {/* Box Front Layer: Lid front lip and Box body with badge (z-index: 3) */}
                        <div id="ballot-box-front">
                            <div className="box-lid-front-lip"></div>
                            <div className="box-body">
                                <div className="box-badge" id="box-badge">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 12 10.5 16.5 18.5 8" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="vote-success-message">
                        <h2>Vote Cast Successfully</h2>
                        <p>Your vote has been recorded.</p>
                    </div>
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