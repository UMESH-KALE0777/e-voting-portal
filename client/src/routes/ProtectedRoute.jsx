// client/src/routes/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

 
const ProtectedRoute = ({ requiredRole, redirectTo = "/login" }) => {
  const { user, token, loading } = useContext(AuthContext);

 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-xs text-gray-400 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

   
  if (!token || !user) {
    return <Navigate to={redirectTo} replace />;
  }
 
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/home" replace />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;