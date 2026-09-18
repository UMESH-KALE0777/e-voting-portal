// client/src/components/footer/Footer.jsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ElectionContext } from "../../context/ElectionContext";
import logo from "../../assets/ballot.png";

const Footer = () => {
  const { election } = useContext(ElectionContext);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  return (
    <footer className="bg-white border-t border-gray-100 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
               
              <img
                src={logo}
                alt="SecureVote"
                className="w-9 h-9 rounded-full object-cover bg-green-500 p-1 shadow-md flex-shrink-0"
              />
              <span className="text-base font-semibold text-gray-900">SecureVote</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Transparent &amp; secure digital elections for a better democracy.
              Your vote, your voice — protected.
            </p>

            {/* Election pills — dynamic */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
                {election?.title || "Lok Sabha 2026"}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                {election?.status === "active" ? "Live Counting" : "Upcoming"}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-medium px-2.5 py-1 rounded-full">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
                {election?.constituency || "Prayagraj"}
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">Navigation</p>
            <ul className="space-y-2">
              <li><Link to="/home" className="text-sm text-gray-500 hover:text-blue-700 transition">Home</Link></li>
              <li><Link to="/candidates" className="text-sm text-gray-500 hover:text-blue-700 transition">Candidates</Link></li>
              <li><Link to="/cast-vote" className="text-sm text-gray-500 hover:text-blue-700 transition">Cast Vote</Link></li>
              <li><Link to="/results" className="text-sm text-gray-500 hover:text-blue-700 transition">Results</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">Account</p>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-sm text-gray-500 hover:text-blue-700 transition">Login</Link></li>
              <li><Link to="/register" className="text-sm text-gray-500 hover:text-blue-700 transition">Register</Link></li>
              <li><Link to="/my-vote" className="text-sm text-gray-500 hover:text-blue-700 transition">My Vote</Link></li>
              <li><Link to="/election-status" className="text-sm text-gray-500 hover:text-blue-700 transition">Election Status</Link></li>
            </ul>
          </div>

          {/* Election Info — dynamic from ElectionContext */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 sm:mb-4">Election Info</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-gray-700">Election Date</p>
                  <p className="text-xs text-gray-400">
                    {election
                      ? `${formatDate(election.startDate)} – ${formatDate(election.endDate)}`
                      : "—"}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-gray-700">Constituency</p>
                  <p className="text-xs text-gray-400">
                    {election?.constituency || "—"}{election?.state ? `, ${election.state}` : ""}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-gray-700">Voting Method</p>
                  <p className="text-xs text-gray-400">Secure digital ballot</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-xs font-medium text-gray-700">Result Status</p>
                  <p className={`text-xs font-medium ${election?.status === "active" ? "text-green-600" : "text-gray-400"}`}>
                    {election?.status === "active" ? "Live counting underway" : election?.status === "completed" ? "Results declared" : "Not started"}
                  </p>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-4 sm:pt-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
          <p>© 2026 SecureVote. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-blue-600">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            End-to-end encrypted voting
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;