// client/src/services/authService.js
import api from "../utils/api"; 

/**
 * Login a user.
 * @param {{ email: string, password: string }} userData
 * @returns {{ user, token }}
 */
export const loginUser = async (userData) => {
  try {
    const { data } = await api.post("/auth/login", userData);
    return data;
  } catch (err) {
     
    throw new Error(err.response?.data?.message || "Login failed. Please try again.");
  }
};

/**
 * Register a new voter.
 * @param {{ name, email, password, voterId, aadhaarNumber, constituency }} userData
 * @returns {{ user, token }}
 */
export const registerUser = async (userData) => {
  try {
    const { data } = await api.post("/auth/register", userData);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Registration failed. Please try again.");
  }
};