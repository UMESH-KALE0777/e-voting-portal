// client/src/pages/Home.jsx
import { useEffect, useState } from "react";
import api from "../utils/api"; 

import HeroSection from "../components/home/HeroSection";
import ElectionInfo from "../components/home/ElectionInfo";
import ElectionTypes from "../components/home/ElectionTypes";
import Statistics from "../components/home/Statistics";
import CandidatePreview from "../components/home/CandidatePreview";
import Guidelines from "../components/home/Guidelines";

const Home = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
       
        const { data } = await api.get("/candidates");
        setCandidates(data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
        // Non-fatal — HeroSection gracefully handles empty candidates array
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">Loading election data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">

     
      <HeroSection candidates={candidates} />

      <ElectionInfo />

      <Statistics />

      <ElectionTypes />
 
      <CandidatePreview />

      <Guidelines />

    </div>
  );
};

export default Home;