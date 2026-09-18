// client/src/pages/NotFound.jsx
import { Link } from "react-router-dom"; // ✅ FIX: added navigation — user was stranded with no way home

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50">

      {/* Icon */}
      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>


      <h1 className="text-5xl sm:text-6xl font-bold text-red-500 mb-2">404</h1>
      <p className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Page Not Found</p>
      <p className="text-sm text-gray-500 text-center max-w-xs mb-7">
        The page you're looking for doesn't exist or has been moved.
      </p>


      <Link
        to="/home"
        className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
        Go to Home
      </Link>

    </div>
  );
};

export default NotFound;