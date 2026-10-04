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
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
                    <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 text-rose-400">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
                    <p className="text-zinc-400 mb-6">Your vote has already been securely recorded. You cannot vote twice.</p>
                    <button
                        onClick={() => navigate('/results')}
                        className="w-full text-white py-3 px-6 rounded-xl font-bold shadow-lg hover:shadow-cyan-500/25 transition-all cursor-pointer"
                        style={{
                            background: 'linear-gradient(-45deg, rgb(0, 153, 255) 0%, cyan 100%)'
                        }}
                    >
                        View Live Results
                    </button>
                </div>
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
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-zinc-300 gap-3">
                <svg className="w-8 h-8 animate-spin text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-lg font-medium">Loading your secure ballot...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pb-16 relative">
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
                        <p>Your vote has been recorded for ALPHA NEURON ELECTIONS.</p>
                    </div>
                </div>
            </div>
            {/* Header */}
            <header className="bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 uppercase tracking-wider">
                                ALPHA NEURON ELECTIONS
                            </span>
                            <span className="text-[11px] text-zinc-500 font-mono">2026</span>
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Official Ballot</h1>
                        <p className="text-sm text-zinc-400">
                            Voter: <span className="font-mono text-cyan-400 font-semibold">{user?.usn}</span> | Year {user?.year} | Sec {user?.section}
                        </p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 transition-all font-medium cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Ballot Content */}
            <main className="max-w-4xl mx-auto px-4 mt-8">
                {/* Top Instruction Banner */}
                <div className="bg-sky-950/40 border border-sky-500/30 rounded-2xl p-4 sm:p-5 mb-8 flex items-start sm:items-center gap-3.5 shadow-lg backdrop-blur-sm">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center shrink-0 text-cyan-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm sm:text-base text-sky-100 font-medium leading-relaxed">
                            After selecting the candidate, cast your vote by clicking the <span className="text-cyan-400 font-bold">&apos;Cast My Vote&apos;</span> button at the bottom.
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="bg-rose-950/50 text-rose-300 p-4 rounded-xl mb-6 text-sm font-medium border border-rose-800/60 flex items-center gap-2">
                        <svg className="w-5 h-5 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {Object.keys(candidatesByRole).length === 0 ? (
                    <div className="text-center py-12 text-zinc-400 bg-zinc-900 rounded-xl border border-zinc-800">
                        No candidates are currently available for your cohort.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(candidatesByRole).map(([role, candidates]) => (
                            <section key={role} className="bg-zinc-900/90 p-6 sm:p-7 rounded-2xl shadow-xl border border-zinc-800/80">
                                <h2 className="text-lg font-bold text-white mb-5 border-b border-zinc-800 pb-3 uppercase tracking-wider flex items-center justify-between">
                                    <span>Select {role}</span>
                                    {selections[role] && (
                                        <span className="text-xs normal-case font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-full">
                                            ✓ Candidate Selected
                                        </span>
                                    )}
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
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                        <p className="text-xs sm:text-sm text-zinc-400 text-center sm:text-left">
                            Ready to submit? Once submitted, your vote is encrypted and final.
                        </p>
                        <button
                            onClick={handleSubmit}
                            disabled={submitStatus === 'submitting'}
                            className="w-full sm:w-auto text-white px-9 py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                            style={{
                                background: 'linear-gradient(-45deg, rgb(0, 153, 255) 0%, cyan 100%)'
                            }}
                        >
                            {submitStatus === 'submitting' ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Submitting Vote...</span>
                                </>
                            ) : (
                                <>
                                    <span>Cast My Vote</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Ballot;