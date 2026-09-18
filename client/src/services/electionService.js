// client/src/services/electionService.js
import api from "../utils/api"; 

/**
 
 * @returns {object} election object (or null if no active election)
 */
export const getActiveElection = async () => {
  try {
    const { data } = await api.get("/election/active");
    return data;
  } catch (err) {
    // 404 = no active election (normal state, not a crash)
    if (err.response?.status === 404) return null;
    throw new Error(err.response?.data?.message || "Failed to fetch election.");
  }
};

/**
  
 * @returns {{ totalVotes, totalVoters }}
 */
export const getVoteStats = async () => {
  try {
    const { data } = await api.get("/votes/stats");
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch vote statistics.");
  }
};

/**
  
 * @returns {Array} 
 */
export const getElectionResults = async () => {
  try {
    const { data } = await api.get("/candidates");
    return [...data].sort((a, b) => b.totalVotes - a.totalVotes);
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch election results.");
  }
};