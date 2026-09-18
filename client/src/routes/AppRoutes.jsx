// client/src/routes/AppRoutes.jsx
import { createBrowserRouter, Navigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";  

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Candidates from "../pages/Candidates";
import CandidateProfile from "../pages/CandidateProfile";
import CastVote from "../pages/CastVote";
import MyVote from "../pages/MyVote";
import ElectionStatus from "../pages/ElectionStatus";
import Results from "../pages/Results";
import AdminDashboard from "../pages/AdminDashboard";
import NotFound from "../pages/NotFound"; 

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [

     
      { index: true, element: <Navigate to="/login" replace /> },

      
      {
        element: <PublicOnlyRoute />,
        children: [
          { path: "login",    element: <Login /> },
          { path: "register", element: <Register /> },
        ],
      },

       
      {
        element: <ProtectedRoute />,
        children: [
          { path: "home",            element: <Home /> },
          { path: "candidates",      element: <Candidates /> },
          { path: "candidate/:id",   element: <CandidateProfile /> },
          { path: "results",         element: <Results /> },
          { path: "election-status", element: <ElectionStatus /> },
        ],
      },

       
      {
        element: <ProtectedRoute requiredRole="VOTER" />,
        children: [
          { path: "cast-vote", element: <CastVote /> },
          { path: "my-vote",   element: <MyVote /> },
        ],
      },

      
      {
        element: <ProtectedRoute requiredRole="ADMIN" />,
        children: [
          { path: "admin", element: <AdminDashboard /> },
        ],
      },

      
      { path: "*", element: <NotFound /> },

    ],
  },
]);

export default router;