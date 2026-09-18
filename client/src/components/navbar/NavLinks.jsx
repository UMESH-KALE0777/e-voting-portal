// client/src/components/navbar/NavLinks.jsx
import { Link, useLocation } from "react-router-dom";

const voterLinks = [
  { to: "/home", label: "Home" },
  { to: "/candidates", label: "Candidates" },
  { to: "/cast-vote", label: "Cast Vote" },
  { to: "/my-vote", label: "My Vote" },
  { to: "/election-status", label: "Election Status" },
  { to: "/results", label: "Results" },
];

const adminLinks = [
  { to: "/home", label: "Home" },
  { to: "/candidates", label: "Candidates" },
  { to: "/results", label: "Results" },
  { to: "/admin", label: "Admin Panel" },
];

 
const NavLinks = ({ onClose, role }) => {
  const { pathname } = useLocation();

   
  const links = role === "ADMIN" ? adminLinks : voterLinks;

  const isActive = (link) =>
    pathname === link.to ||
    (link.to === "/candidates" && pathname.startsWith("/candidate")) ||
    (link.to === "/admin" && pathname.startsWith("/admin"));

  return (
    <nav className="flex flex-col md:flex-row items-start md:items-center gap-1">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          onClick={(e) => {
            if (isActive(link)) e.preventDefault();
            onClose?.();
          }}
          className={`text-sm px-3 py-2 rounded-lg transition w-full md:w-auto
            ${
              link.to === "/admin"
                ? isActive(link)
                  ? "bg-orange-50 text-orange-700 font-medium"
                  : "text-orange-600 hover:bg-orange-50"
                : isActive(link)
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
            }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

export default NavLinks;