// client/src/pages/Register.jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api"; 
import { AuthContext } from "../context/AuthContext";

const CONSTITUENCIES = [
  "Prayagraj", "Varanasi", "Lucknow", "Kanpur", "Agra",
  "Meerut", "Bareilly", "Aligarh", "Moradabad", "Saharanpur",
  "Gorakhpur", "Faizabad", "Ambedkar Nagar", "Nagina", "Amethi",
];

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "", email: "", password: "",
    voterId: "", aadhaarNumber: "", constituency: "",
  });
  const [showPassword, setShowPassword] = useState(false); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  
  const validate = () => {
    if (formData.name.trim().length < 2) return "Full name must be at least 2 characters.";
    if (formData.password.length < 6) return "Password must be at least 6 characters.";
    if (!/^\d{12}$/.test(formData.aadhaarNumber)) return "Aadhaar must be exactly 12 digits.";
    if (!formData.constituency) return "Please select your constituency.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
       
      const { data } = await api.post("/auth/register", formData);
      login(data.user, data.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">SecureVote</h1>
          <p className="text-sm text-gray-500 mt-1">Create your voter account</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Full name</label>
              <input
                type="text" name="name" placeholder="Rahul Kumar"
                onChange={handleChange} required
                autoComplete="name"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email" name="email" placeholder="you@example.com"
                onChange={handleChange} required
                autoComplete="email"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
               
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 6 characters"
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Voter ID + Aadhaar side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Voter ID</label>
                <input
                  type="text" name="voterId" placeholder="UP/12/345"
                  onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Aadhaar</label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  placeholder="12 digits"
                  onChange={handleChange}
                  required
                  maxLength={12}  
                  inputMode="numeric" 
                  pattern="\d{12}"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Constituency dropdown */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Your constituency
              </label>
              <select
                name="constituency"
                onChange={handleChange}
                required
                defaultValue=""
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>Select your constituency</option>
                {CONSTITUENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

             
            {error && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c.866 1.5-.217 3.374-1.948 3.374H2.645c-1.73 0-2.813-1.874-1.948-3.374L10.051 3.378c.866-1.5 3.032-1.5 3.898 0l7.354 12.748zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 active:scale-95 text-white py-3 rounded-xl text-sm font-semibold transition disabled:opacity-60 mt-1 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-700 font-medium hover:underline">Sign in</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;