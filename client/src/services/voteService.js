// client/src/services/voteService.js
import api from "../utils/api"; 

/**
 * Cast a vote for a candidate.
 * @param {{ candidateId: string }} voteData
 * @returns {object} vote confirmation object
 */
export const castVote = async (voteData) => {
  try {
    const { data } = await api.post("/votes/cast", voteData);
    return data;
  } catch (err) {
     
    throw new Error(err.response?.data?.message || "Failed to cast vote. Please try again.");
  }
};

/**
 
 * @returns {object|null} vote object with populated candidate, or null
 */
export const getMyVote = async () => {
  try {
    const { data } = await api.get("/votes/my-vote");
    return data;
  } catch (err) {
     
    if (err.response?.status === 404) return null;
    throw new Error(err.response?.data?.message || "Failed to fetch your vote.");
  }
};

/**
 
 * @returns {{ totalVotes: number, totalVoters: number }}
 */
export const getVoteStats = async () => {
  try {
    const { data } = await api.get("/votes/stats");
    return data;
  } catch (err) {
    throw new Error(err.response?.data?.message || "Failed to fetch vote statistics.");
  }
};