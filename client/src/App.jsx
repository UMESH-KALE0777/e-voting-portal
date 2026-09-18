import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Ballot from './pages/Ballot';
import Results from './pages/Results';

// A simple protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/ballot"
          element={
            <ProtectedRoute>
              <Ballot />
            </ProtectedRoute>
          }
        />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;