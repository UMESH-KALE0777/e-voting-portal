// client/src/components/admin/CandidatesTab.jsx
import { useState } from "react";
import api from "../../utils/api";

// const BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";

const getInitials = (name) =>
  name?.split(" ").map((n) => n[0]).join("").toUpperCase() || "?";

const CandidatesTab = ({ candidates = [], onAddNew, onRefresh }) => {

  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [imgErrors, setImgErrors] = useState({});
  const [search, setSearch] = useState("");

  const handleDeleteClick = (id) => {
    setConfirmId(id);
    setDeleteError("");
  };

  const handleDeleteConfirm = async (id) => {
    try {
      setDeletingId(id);
      setDeleteError("");

      await api.delete(`/candidates/${id}`);
      setConfirmId(null);
      onRefresh();
    } catch (err) {

      setDeleteError(err.response?.data?.message || "Failed to delete candidate.");
    } finally {
      setDeletingId(null);
    }
  };


  const filtered = candidates.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.party?.toLowerCase().includes(q) ||
      c.constituency?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, party, constituency..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <button
          onClick={onAddNew}
          className="flex items-center gap-1.5 text-sm bg-blue-700 text-white px-4 py-2.5 rounded-xl hover:bg-blue-800 transition font-medium flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add candidate
        </button>
      </div>


      {deleteError && (
        <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H2.645c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0l7.354 12.748zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {deleteError}
        </div>
      )}

      {/* Candidate list */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">
            All candidates ({candidates.length})
          </p>
          {search && (
            <p className="text-xs text-gray-400">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
          )}
        </div>

        <div className="divide-y divide-gray-50">
          {candidates.length === 0 && (
            <div className="py-12 text-center">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <p className="text-sm text-gray-400">No candidates added yet.</p>
            </div>
          )}

          {candidates.length > 0 && filtered.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm text-gray-400">No candidates match your search.</p>
              <button onClick={() => setSearch("")} className="text-xs text-blue-600 hover:underline mt-1">Clear search</button>
            </div>
          )}

          {filtered.map((c) => (
            <div key={c._id} className="px-4 sm:px-5 py-3 sm:py-4">

              {/* Main row */}
              <div className="flex items-center gap-3">

                {c.image && !imgErrors[c._id] ? (
                  <img
                    src={c.image}

                    onError={() => setImgErrors((prev) => ({ ...prev, [c._id]: true }))}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0 border border-gray-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-800 text-sm font-semibold flex items-center justify-center flex-shrink-0">
                    {getInitials(c.name)}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{c.name}</p>
                  <p className="text-xs text-gray-500 truncate">{c.party} · {c.constituency}</p>
                </div>

                <div className="text-right flex-shrink-0 mr-2 sm:mr-4">
                  <p className="text-sm font-semibold text-gray-900">{c.totalVotes ?? 0}</p>
                  <p className="text-xs text-gray-400">votes</p>
                </div>


                {confirmId === c._id ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleDeleteConfirm(c._id)}
                      disabled={deletingId === c._id}
                      className="text-xs bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg transition disabled:opacity-60 flex items-center gap-1"
                    >
                      {deletingId === c._id && (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      )}
                      {deletingId === c._id ? "..." : "Confirm"}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="text-xs text-gray-500 hover:text-gray-700 px-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDeleteClick(c._id)}
                    className="text-xs text-red-500 hover:text-red-700 border border-red-100 hover:bg-red-50 px-3 py-1.5 rounded-lg transition flex-shrink-0"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {candidates.length > 0 && (
          <div className="px-4 sm:px-5 py-3 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-400">Showing {filtered.length} of {candidates.length} candidates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidatesTab;