// client/src/components/admin/ElectionTab.jsx
import { useEffect, useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import { ElectionContext } from "../../context/ElectionContext";

// ─── Constants ────────────────────────────────────────────────
const ELECTION_TYPES = ["Lok Sabha", "Assembly", "Municipal"];

const STATUS_STYLES = {
  live:     "bg-green-100  text-green-700",
  ended:    "bg-red-100    text-red-700",
  upcoming: "bg-yellow-100 text-yellow-700",
};

const DEFAULT_FORM = {
  title:     "",
  type:      "Lok Sabha",
  state:     "",
  startDate: "",
  endDate:   "",
};

// ─── Helpers ──────────────────────────────────────────────────
const toDateInput = (iso) => iso?.split("T")[0] ?? "";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

// ─── Sub-components ───────────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-700 mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm " +
  "focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

// ─── Main Component ───────────────────────────────────────────
const ElectionTab = () => {
  const { election, refetch } = useContext(ElectionContext);

  const [form,       setForm]       = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [success,    setSuccess]    = useState("");
  const [error,      setError]      = useState("");

  useEffect(() => {
    if (election) {
      setForm({
        title:     election.title     || "",
        type:      election.type      || "Lok Sabha",
        state:     election.state     || "",
        startDate: toDateInput(election.startDate),
        endDate:   toDateInput(election.endDate),
      });
    }
  }, [election]);

  const patch = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (election?._id) {
        
        await api.put(`/election/${election._id}`, form);
        setSuccess("Election updated successfully!");
      } else {
        await api.post("/election", form);
        setSuccess("Election created successfully!");
      }
      refetch();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save election.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto px-2 sm:px-0">

      {/* ── Active election info card ── */}
      {election && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
            <p className="text-sm font-semibold text-blue-900">Active Election</p>
          </div>

          <p className="text-sm text-blue-700 font-medium break-words">
            {election.title}
          </p>

          <p className="text-xs text-blue-500 mt-1 flex flex-wrap gap-x-1">
            <span>{election.type}</span>
            {election.state && <><span>·</span><span>{election.state}</span></>}
          </p>

          <p className="text-xs text-blue-500 mt-0.5">
            {formatDate(election.startDate)} → {formatDate(election.endDate)}
          </p>

          <span className={`inline-block mt-2 text-xs font-medium px-2.5 py-1 rounded-full
            ${STATUS_STYLES[election.status] ?? STATUS_STYLES.upcoming}`}>
            {election.status?.toUpperCase()}
          </span>
        </div>
      )}

      {/* ── Form card ── */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6">
        <p className="text-sm font-semibold text-gray-900 mb-5">
          {election ? "Update election details" : "Create new election"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <Field label="Election title">
            <input
              type="text"
              placeholder="India General Election 2026"
              value={form.title}
              onChange={patch("title")}
              required
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <Field label="Election type">
              <select value={form.type} onChange={patch("type")} className={inputCls}>
                {ELECTION_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>

            <Field label="State">
              <input
                type="text"
                placeholder="Uttar Pradesh"
                value={form.state}
                onChange={patch("state")}
                className={inputCls}
              />
            </Field>

            <Field label="Start date">
              <input
                type="date"
                value={form.startDate}
                onChange={patch("startDate")}
                required
                className={inputCls}
              />
            </Field>

            <Field label="End date">
              <input
                type="date"
                value={form.endDate}
                onChange={patch("endDate")}
                required
                className={inputCls}
              />
            </Field>

          </div>

          {/* ── Info note ── */}
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
            <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-xs text-amber-800">
              Constituency is not set at the election level. Each voter automatically sees only
              candidates from their own registered constituency.
            </p>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {success && (
            <p className="text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900
              text-white py-3 rounded-xl text-sm font-semibold transition
              disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {submitting ? "Saving…" : election ? "Update election" : "Create election"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ElectionTab;