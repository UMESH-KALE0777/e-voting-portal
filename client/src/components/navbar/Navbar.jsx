// client/src/components/navbar/Navbar.jsx
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import CountdownTimer from "./CountdownTimer";
import ProfileMenu from "./ProfileMenu";
import logo from "../../assets/ballot.png";

const Navbar = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, logout } = useContext(AuthContext);
  const profileRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowMenu(false);
    setShowProfile(false);
  };


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    setShowMenu(false);
    setShowProfile(false);
  }, [pathname]);

  const voterLinks = [
    { to: "/home", label: "Home" },
    { to: "/candidates", label: "Candidates" },
    { to: "/cast-vote", label: "Cast Vote" },
    { to: "/my-vote", label: "My Vote" },
    { to: "/election-status", label: "Status" },
    { to: "/results", label: "Results" },
  ];

  const adminLinks = [
    { to: "/home", label: "Home" },
    { to: "/candidates", label: "Candidates" },
    { to: "/results", label: "Results" },
    { to: "/admin", label: "Admin Panel" },
  ];

  const links = user?.role === "ADMIN" ? adminLinks : voterLinks;

  const isActive = (link) =>
    pathname === link.to ||
    (link.to === "/candidates" && pathname.startsWith("/candidate")) ||
    (link.to === "/admin" && pathname.startsWith("/admin"));

  const handleNavClick = (e, link) => {
    if (isActive(link)) {
      e.preventDefault();
    }
    setShowMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
          <img
            src={logo}
            alt="SecureVote"
            className="w-9 h-9 rounded-full object-cover bg-green-500 p-1 shadow-md"
          />
          <div>
            <span className="text-sm font-bold text-pink-500 leading-none">SecureVote</span>
            <p className="text-xs text-gray-400 leading-none mt-0.5">
              {user?.role === "ADMIN" ? "Election Commission" : "Digital Elections"}
            </p>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={(e) => handleNavClick(e, link)}
              className={`text-sm px-3 py-2 rounded-full transition-all duration-200 font-medium
                ${link.to === "/admin"
                  ? isActive(link)
                    ? "bg-orange-50 text-orange-700"
                    : "text-orange-600 hover:bg-orange-50"
                  : isActive(link)
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                }`}
            >
              {link.to === "/admin" ? (
                <span className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                  </svg>
                  {link.label}
                </span>
              ) : (
                link.label
              )}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">

          <div className="hidden sm:block">
            <CountdownTimer />
          </div>


          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setShowProfile((p) => !p);
                  setShowMenu(false);
                }}
                className={`w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center transition
                  ${user.role === "ADMIN"
                    ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
              >
                {user.name?.charAt(0).toUpperCase() || "U"}
              </button>
              {showProfile && (
                <ProfileMenu
                  user={user}
                  onLogout={handleLogout}
                  onClose={() => setShowProfile(false)}
                />
              )}
            </div>
          ) : (

            <Link
              to="/login"
              className="text-sm bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
            >
              Login
            </Link>
          )}

          {/* Hamburger — mobile only */}
          <button
            onClick={() => {
              setShowMenu((p) => !p);
              setShowProfile(false);
            }}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {showMenu ? (
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {showMenu && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">


          <div className="px-3 py-2">
            <CountdownTimer />
          </div>

          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={(e) => handleNavClick(e, link)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition
                ${isActive(link)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              {link.label}
              {isActive(link) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </Link>
          ))}

          {/* Constituency badge in mobile menu */}
          {user?.constituency && (
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 rounded-xl mt-2">
              <svg
                className="w-3.5 h-3.5 text-green-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <span className="text-xs text-green-700 font-medium truncate">
                {user.constituency} constituency
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition mt-1"
          >
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;