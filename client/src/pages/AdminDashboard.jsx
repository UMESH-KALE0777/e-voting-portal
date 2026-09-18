// client/src/pages/AdminDashboard.jsx
import { useEffect, useState, useContext } from "react";
import api from "../utils/api"; // ✅ FIX 1: replaced raw axios + localhost:5000
import { AuthContext } from "../context/AuthContext";
import AdminHeader from "../components/admin/AdminHeader";
import AdminTabs from "../components/admin/AdminTabs";
import OverviewTab from "../components/admin/OverviewTab";
import CandidatesTab from "../components/admin/CandidatesTab";
import AddCandidateTab from "../components/admin/AddCandidateTab";
import VotersTab from "../components/admin/VotersTab";
import ElectionTab from "../components/admin/ElectionTab";

const AdminDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, candidatesRes, votersRes] = await Promise.all([
        api.get("/admin/stats"), 
        api.get("/candidates"),
        api.get("/admin/voters"),
      ]);
      setStats(statsRes.data);
      setCandidates(candidatesRes.data);
      setVoters(votersRes.data);
    } catch (err) {
      console.error("AdminDashboard fetch error:", err);
      setError("Failed to load dashboard data. Please refresh.");  
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
      <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm">Loading dashboard...</span>
    </div>
  );

   
  if (error) return (
    <div className="max-w-md mx-auto py-20 px-4 text-center">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <p className="text-sm text-gray-600 font-medium mb-1">Dashboard failed to load</p>
      <p className="text-xs text-gray-400 mb-4">{error}</p>
      <button
        onClick={fetchAll}
        className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-xl transition"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-8 px-4">
      <AdminHeader user={user} />
      <AdminTabs active={tab} onChange={setTab} />

      {tab === "overview" && (
        <OverviewTab stats={stats} token={token} onRefresh={fetchAll} />
      )}
      {tab === "election" && (
        <ElectionTab />
      )}
      {tab === "candidates" && (
        <CandidatesTab
          candidates={candidates}
          token={token}
          onAddNew={() => setTab("add")}
          onRefresh={fetchAll}
        />
      )}
      {tab === "add" && (
        <AddCandidateTab
          token={token}
          onSuccess={() => { fetchAll(); setTab("candidates"); }}
        />
      )}
      {tab === "voters" && (
        <VotersTab voters={voters} />
      )}
    </div>
  );
};

export default AdminDashboard;