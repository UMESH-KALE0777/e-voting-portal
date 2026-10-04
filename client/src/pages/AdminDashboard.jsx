import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Layout & UI States
  const [activeTab, setActiveTab] = useState('results');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('General Secretary');
  const [year, setYear] = useState('1');
  const [section, setSection] = useState('A');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Results & API State
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Security Check & Route Guard
  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Fetch Live Results
  const fetchLiveResults = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const response = await API.get('/admin/results');
      setCandidates(response.data.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch election results.' });
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [navigate]);

  // Fetch data on tab focus & Auto-Refresh Interval
  useEffect(() => {
    if (activeTab === 'results') {
      fetchLiveResults();
    }
  }, [activeTab, fetchLiveResults]);

  useEffect(() => {
    let interval = null;
    if (autoRefresh && activeTab === 'results') {
      interval = setInterval(() => {
        fetchLiveResults(true);
      }, 10000); // Polls every 10 seconds
    }
    return () => clearInterval(interval);
  }, [autoRefresh, activeTab, fetchLiveResults]);

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('year', year);
    formData.append('section', section);
    if (image) formData.append('image', image);

    try {
      await API.post('/admin/candidate', formData);
      setMessage({ type: 'success', text: 'Candidate successfully registered!' });

      // Reset Form State cleanly
      setName('');
      setRole('General Secretary');
      setYear('1');
      setSection('A');
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to add candidate. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFactoryReset = async () => {
    if (resetConfirmText.trim().toUpperCase() !== 'RESET') return;

    setLoading(true);
    try {
      await API.delete('/admin/reset');
      setMessage({ type: 'success', text: 'Election data completely reset.' });
      setCandidates([]);
      setShowResetModal(false);
      setResetConfirmText('');
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to reset election system.' });
    } finally {
      setLoading(false);
    }
  };

  // Calculations for Metrics
  const totalVotes = candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0);
  const leadingCandidate = candidates.length > 0
    ? [...candidates].sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))[0]
    : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-20 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-inner">
              A
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">Election Control Center</h1>
              <p className="text-xs text-slate-400">Administrator Console</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 rounded-lg border border-slate-700 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col md:flex-row gap-8">

        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-2 space-y-1">
            <button
              onClick={() => setActiveTab('results')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'results'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Live Results
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'add'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add Nomination
            </button>
          </div>

          {/* System Operations Section */}
          <div className="bg-red-50/60 rounded-xl border border-red-100 p-4 space-y-3">
            <h3 className="text-xs font-semibold text-red-800 uppercase tracking-wider">Danger Zone</h3>
            <p className="text-xs text-red-600/90 leading-relaxed">
              Resetting will clear candidate registrations and student voting logs permanently.
            </p>
            <button
              onClick={() => setShowResetModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Reset Election
            </button>
          </div>
        </aside>

        {/* Content Viewport */}
        <div className="flex-1 space-y-6">

          {/* Status Message Notification */}
          {message.text && (
            <div className={`flex items-center justify-between p-4 rounded-xl text-sm border shadow-sm transition-all ${message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                {message.text}
              </div>
              <button onClick={() => setMessage({ type: '', text: '' })} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
          )}

          {/* TAB 1: LIVE RESULTS TABULATION */}
          {activeTab === 'results' && (
            <div className="space-y-6">

              {/* Analytics Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase">Total Votes Cast</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{totalVotes.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase">Candidates Listed</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{candidates.length}</p>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
                  <p className="text-xs font-medium text-slate-500 uppercase">Current Leader</p>
                  <p className="text-lg font-bold text-blue-600 truncate mt-1">
                    {leadingCandidate && leadingCandidate.voteCount > 0 ? leadingCandidate.name : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Main Tabulation Board */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Live Tabulation</h2>
                    <p className="text-xs text-slate-500">Real-time candidate standings and vote distribution</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      Auto-Refresh (10s)
                    </label>

                    <button
                      onClick={() => fetchLiveResults(false)}
                      disabled={isRefreshing}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {isRefreshing ? 'Syncing...' : 'Refresh'}
                    </button>
                  </div>
                </div>

                {/* Candidate List Render */}
                <div className="space-y-4">
                  {candidates.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <p className="text-sm">No candidate nominations registered yet.</p>
                    </div>
                  ) : (
                    candidates.map((c) => {
                      const percentage = totalVotes > 0 ? ((c.voteCount / totalVotes) * 100).toFixed(1) : 0;
                      const isLeader = leadingCandidate?._id === c._id && c.voteCount > 0;

                      return (
                        <div key={c._id} className="p-4 border border-slate-200/80 rounded-xl hover:border-slate-300 transition-all bg-white">
                          <div className="flex items-center justify-between gap-4">

                            {/* Candidate Info */}
                            <div className="flex items-center gap-4 min-w-0">
                              {c.image ? (
                                <img src={c.image} alt={c.name} className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0" />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                                  {c.name.charAt(0)}
                                </div>
                              )}

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-slate-900 truncate text-base">{c.name}</h3>
                                  {isLeader && (
                                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 rounded-full border border-amber-200">
                                      Leader
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                                  <span className="font-medium text-slate-700">{c.role}</span>
                                  <span>&bull;</span>
                                  <span>Year {c.year}</span>
                                  <span>&bull;</span>
                                  <span>Sec {c.section}</span>
                                </div>
                              </div>
                            </div>

                            {/* Vote Statistics */}
                            <div className="text-right shrink-0">
                              <span className="text-2xl font-black text-slate-900">{c.voteCount || 0}</span>
                              <span className="text-xs text-slate-400 block font-medium">
                                {percentage}% of total
                              </span>
                            </div>
                          </div>

                          {/* Relative Progress Bar */}
                          <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 rounded-full ${isLeader ? 'bg-amber-500' : 'bg-blue-600'}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADD NOMINATION FORM */}
          {activeTab === 'add' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-6 sm:p-8 max-w-2xl">
              <div className="mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Register New Candidate</h2>
                <p className="text-xs text-slate-500">Add candidate parameters to include them in the official ballot.</p>
              </div>

              <form onSubmit={handleAddCandidate} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Full Candidate Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Contested Position / Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  >
                    <option value="General Secretary">General Secretary</option>
                    <option value="Class Representative">Class Representative</option>
                    <option value="Ladies Representative">Ladies Representative</option>
                    <option value="Sports Secretary">Sports Secretary</option>
                    <option value="Cultural Secretary">Cultural Secretary</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    >
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">Section</label>
                    <select
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="Combined">Combined</option>
                    </select>
                  </div>
                </div>

                {/* File Upload with Preview */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Candidate Headshot
                  </label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-14 h-14 rounded-full object-cover border border-slate-200" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                        No image
                      </div>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-all shadow-sm disabled:opacity-50 mt-4"
                >
                  {loading ? 'Submitting Candidate...' : 'Confirm & Register Candidate'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Modern Confirmation Modal for Dangerous Actions */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Confirm System Reset</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will permanently delete all candidate nominations and wipe all voter tracking logs. To confirm, type <strong className="text-slate-900 select-none">RESET</strong> below:
            </p>

            <input
              type="text"
              value={resetConfirmText}
              onChange={(e) => setResetConfirmText(e.target.value)}
              placeholder="Type RESET"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-600"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowResetModal(false);
                  setResetConfirmText('');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleFactoryReset}
                disabled={resetConfirmText.trim().toUpperCase() !== 'RESET' || loading}
                className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all shadow-sm disabled:opacity-40"
              >
                {loading ? 'Wiping Data...' : 'Wipe System Data'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;