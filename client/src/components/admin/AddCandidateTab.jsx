// client/src/components/admin/AddCandidateTab.jsx
import { useState } from "react";
import api from "../../utils/api";

const fields = [
  { label: "Full name", name: "name", placeholder: "Rahul Sharma" },
  { label: "Party name", name: "party", placeholder: "Development Party" },
  { label: "Age", name: "age", placeholder: "45", type: "number" },
  { label: "Constituency", name: "constituency", placeholder: "Prayagraj" },
  { label: "Education", name: "education", placeholder: "MBA" },
  { label: "Experience", name: "experience", placeholder: "10 years in public service" },
];

const emptyCandidate = () => ({
  name: "", party: "", age: "", constituency: "",
  manifesto: "", education: "", experience: "",
  image: null,
  imagePreview: null,
  id: Date.now() + Math.random(),
});

const AddCandidateTab = ({ token, onSuccess }) => {
  const [candidates, setCandidates] = useState([emptyCandidate()]);
  const [submitting, setSubmitting] = useState(false);
  const [results, setResults] = useState([]); // per-candidate status
  const [globalError, setGlobalError] = useState("");

  const updateCandidate = (id, key, value) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );
  };

  const handleImageChange = (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    updateCandidate(id, "image", file);
    updateCandidate(id, "imagePreview", URL.createObjectURL(file));
  };

  const addRow = () => {
    setCandidates((prev) => [...prev, emptyCandidate()]);
    setResults([]);
  };

  const removeRow = (id) => {
    if (candidates.length === 1) return;
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    setResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    setResults([]);
    setSubmitting(true);

    const statuses = [];

    for (const candidate of candidates) {
      try {
        const formData = new FormData();
        const { image, imagePreview, id, ...rest } = candidate;
        Object.entries(rest).forEach(([k, v]) => formData.append(k, v));
        if (image) formData.append("image", image);

        await api.post("/candidates", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        statuses.push({ id, name: candidate.name, success: true });
      } catch (err) {
        statuses.push({
          id,
          name: candidate.name,
          success: false,
          error: err.response?.data?.message || "Failed",
        });
      }
    }

    setResults(statuses);
    setSubmitting(false);

    const allSuccess = statuses.every((s) => s.success);
    if (allSuccess) {
      setTimeout(() => {
        setCandidates([emptyCandidate()]);
        setResults([]);
        onSuccess();
      }, 1500);
    }
  };

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-gray-900">Register candidates</p>
          <p className="text-xs text-gray-400 mt-0.5">Add one or multiple candidates at once</p>
        </div>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-2 rounded-lg transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add another
        </button>
      </div>

      {/* Batch result summary */}
      {results.length > 0 && (
        <div className={`mb-4 px-4 py-3 rounded-xl border text-xs font-medium flex items-center gap-2
          ${failCount === 0 ? "bg-green-50 border-green-200 text-green-700" : "bg-orange-50 border-orange-200 text-orange-700"}`}>
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={failCount === 0
              ? "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              : "M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"} />
          </svg>
          {failCount === 0
            ? `All ${successCount} candidate${successCount > 1 ? "s" : ""} added successfully!`
            : `${successCount} added · ${failCount} failed`}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {candidates.map((candidate, idx) => {
          const result = results.find((r) => r.id === candidate.id);
          return (
            <div
              key={candidate.id}
              className={`bg-white border-2 rounded-2xl p-5 transition-all
                ${result?.success ? "border-green-300 bg-green-50/30"
                  : result?.error ? "border-red-300 bg-red-50/20"
                    : "border-gray-100"}`}
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                    ${result?.success ? "bg-green-100 text-green-700"
                      : result?.error ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"}`}>
                    {result?.success ? "✓" : result?.error ? "✗" : idx + 1}
                  </div>
                  <p className="text-xs font-semibold text-gray-700">
                    {candidate.name || `Candidate ${idx + 1}`}
                  </p>
                  {result?.error && (
                    <span className="text-xs text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">
                      {result.error}
                    </span>
                  )}
                </div>
                {candidates.length > 1 && !submitting && (
                  <button
                    type="button"
                    onClick={() => removeRow(candidate.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Photo upload */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-2">Candidate photo</label>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {candidate.imagePreview ? (
                      <img src={candidate.imagePreview} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                  </div>
                  <label className="cursor-pointer bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs px-3 py-2 rounded-lg transition font-medium">
                    {candidate.imagePreview ? "Change photo" : "Choose photo"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(candidate.id, e)}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-400">JPG, PNG or WEBP · Max 2MB</p>
                </div>
              </div>

              {/* Fields grid */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                {fields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      placeholder={field.placeholder}
                      value={candidate[field.name]}
                      onChange={(e) => updateCandidate(candidate.id, field.name, e.target.value)}
                      required
                      disabled={submitting || result?.success}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
                    />
                  </div>
                ))}
              </div>

              {/* Manifesto */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Manifesto / Key promises (comma separated)
                </label>
                <textarea
                  placeholder="Smart roads, jobs, hospitals and digital education"
                  value={candidate.manifesto}
                  onChange={(e) => updateCandidate(candidate.id, "manifesto", e.target.value)}
                  required
                  rows={2}
                  disabled={submitting || result?.success}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-400"
                />
              </div>
            </div>
          );
        })}

        {/* Add more row hint */}
        {candidates.length < 10 && !submitting && results.length === 0 && (
          <button
            type="button"
            onClick={addRow}
            className="w-full border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 rounded-2xl py-4 text-xs text-gray-400 hover:text-blue-600 font-medium transition flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add another candidate
          </button>
        )}

        {globalError && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {globalError}
          </p>
        )}

        {/* Submit */}
        {results.every((r) => r.success) && results.length > 0 ? null : (
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Adding {candidates.length} candidate{candidates.length > 1 ? "s" : ""}...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add {candidates.length} candidate{candidates.length > 1 ? "s" : ""}
              </>
            )}
          </button>
        )}
      </form>
    </div>
  );
};

export default AddCandidateTab;