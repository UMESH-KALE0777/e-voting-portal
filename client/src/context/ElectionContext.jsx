// client/src/context/ElectionContext.jsx
import { createContext, useEffect, useState } from "react";
import api from "../utils/api";

export const ElectionContext = createContext();

const ElectionProvider = ({ children }) => {
  const [election, setElection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchElection = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/election/active");
      setElection(data);
    } catch (err) {
      if (err.response?.status === 404) {
        
        setElection(null);
      } else {
        console.error("Election fetch error:", err.response?.data || err.message);
        setError("Failed to load election data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElection();
  }, []);

  return (
    <ElectionContext.Provider value={{ election, loading, error, refetch: fetchElection }}>
      {children}
    </ElectionContext.Provider>
  );
};

export default ElectionProvider;