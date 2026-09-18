// client/src/components/navbar/ProfileMenu.jsx
import { Link } from "react-router-dom";
const voterMenuItems = [
  {
    to: "/my-vote",
    label: "My Vote",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    to: "/election-status",
    label: "Election Status",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm9.75-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v10.125c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V9.75zm-9.75 3.375" />
      </svg>
    ),
  },
  {
    to: "/results",
    label: "Results",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
  },
];

 
const adminMenuItems = [
  {
    to: "/admin",
    label: "Admin Panel",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    to: "/results",
    label: "Results",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
  },
];

const ProfileMenu = ({ user, onLogout, onClose }) => {
 
  const menuItems = user?.role === "ADMIN" ? adminMenuItems : voterMenuItems;

  return (
    <div className="absolute right-0 top-11 w-52 bg-white rounded-xl border border-gray-100 shadow-lg overflow-hidden z-50">

      {/* User info */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center flex-shrink-0
              ${user?.role === "ADMIN"
                ? "bg-orange-100 text-orange-800"
                : "bg-blue-100 text-blue-800"
              }`}
          >
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || "Voter"}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email || "Voter Account"}</p>
          </div>
        </div>

        {/* Role badge */}
        <div className="mt-2">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${user?.role === "ADMIN"
                ? "bg-orange-50 text-orange-700"
                : "bg-green-50 text-green-700"
              }`}
          >
            {user?.role === "ADMIN" ? "Election Commission" : "Verified Voter"}
          </span>
        </div>
      </div>

      {/* Links */}
      <ul className="py-1">
        {menuItems.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={onClose}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <span className="text-gray-400">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}

        <li className="border-t border-gray-100 mt-1">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileMenu;