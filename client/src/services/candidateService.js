// client/src/services/candidateService.js
import api from "../utils/api";  

/**
 * Fetch all candidates.
 * @returns {Array} list of candidate objects
 */
export const getCandidates = async () => {
  try {
    const { data } = await api.get("/candidates");
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch candidates.");
  }
};

/**
  
  
 * @param {string} id - candidate MongoDB _id
 * @returns {object} candidate object
 */
export const getCandidateById = async (id) => {
  try {
    const { data } = await api.get(`/candidates/${id}`);
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Candidate not found.");
  }
};