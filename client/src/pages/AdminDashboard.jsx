import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('results');

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('General Secretary');
  const [year, setYear] = useState('1');
  const [section, setSection] = useState('A');
  const [image, setImage] = useState(null);

  // Results State
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Security check: Redirect if no admin token
  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login');
    } else if (activeTab === 'results') {
      fetchLiveResults();
    }
  }, [activeTab, navigate]);

  const fetchLiveResults = async () => {
    try {
      const response = await API.get('/admin/results');
      setCandidates(response.data.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/admin/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Using FormData to handle the image file upload
    const formData = new FormData();
    formData.append('name', name);
    formData.append('role', role);
    formData.append('year', year);
    formData.append('section', section);
    if (image) formData.append('image', image);

    try {
      await API.post('/admin/candidate', formData);
      setMessage({ type: 'success', text: 'Candidate successfully added!' });
      setName('');
      setImage(null);
      document.getElementById('imageInput').value = '';
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add candidate' });
    }
    setLoading(false);
  };

  const handleFactoryReset = async () => {
    const isConfirmed = window.confirm(
      "DANGER: This will permanently delete all candidates and reset all student voting statuses. Are you absolutely sure?"
    );
    if (!isConfirmed) return;

    try {
      await API.delete('/admin/reset');
      setMessage({ type: 'success', text: 'Election data completely wiped.' });
      setCandidates([]);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to reset election.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-slate-900 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Control Center</h1>
          <button onClick={handleLogout} className="text-slate-300 hover:text-white text-sm">
            Sign Out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 space-y-2">
          <button
            onClick={() => setActiveTab('results')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'results' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
          >
            Live Results
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'add' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border'}`}
          >
            Add Nomination
          </button>

          <div className="pt-8">
            <button
              onClick={handleFactoryReset}
              className="w-full text-left px-4 py-3 rounded-lg font-medium bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
            >
              ⚠️ Reset Election
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {message.text && (
            <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          {activeTab === 'results' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Live Tabulation</h2>
                <button onClick={fetchLiveResults} className="text-sm text-blue-600 hover:underline">Refresh</button>
              </div>
              <div className="space-y-4">
                {candidates.length === 0 ? <p className="text-gray-500">No candidates available.</p> :
                  candidates.map(c => (
                    <div key={c._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        {c.image && <img src={c.image} alt={c.name} className="w-10 h-10 rounded-full object-cover border" />}
                        <div>
                          <p className="font-bold text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.role} • Yr {c.year} • Sec {c.section}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{c.voteCount}</p>
                        <p className="text-xs text-gray-500">votes</p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Register Candidate</h2>
              <form onSubmit={handleAddCandidate} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 border rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position / Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white">
                    <option value="General Secretary">General Secretary</option>
                    <option value="Class Representative">Class Representative</option>
                    <option value="Ladies Representative">Ladies Representative</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <select value={year} onChange={(e) => setYear(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white">
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <select value={section} onChange={(e) => setSection(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white">
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                      <option value="Combined">Combined</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Photo</label>
                  <input type="file" id="imageInput" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>

                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium mt-4 disabled:opacity-50">
                  {loading ? 'Registering...' : 'Register Candidate'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;