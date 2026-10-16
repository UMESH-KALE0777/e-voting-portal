/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state directly from localStorage synchronously to avoid cascading renders
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        return JSON.parse(storedUser);
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return null;
  });

  const [loading] = useState(false);

  const login = async (usn, year, section) => {
    try {
      const response = await API.post('/auth/login', { usn, year, section });
      const { token, student } = response.data;

      // Save to localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(student));

      setUser(student);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};