import React, { useState, useEffect } from "react";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import CreateListing from "./pages/CreateListing.jsx";
import ViewListings from "./pages/ViewListing.jsx";
import "./App.css";
import ListingDetail from "./pages/ListingDetail.jsx";
import ArchivedListings from "./pages/Archived.jsx";
import Navbar from "./pages/Navbar.jsx";
import MembersWithListings from "./pages/Members.jsx";
import LandingPage from "./pages/Landing.jsx";
import LoginPage from "./pages/Login.jsx";
import SignupPage from "./pages/SignUp.jsx";
import { Unauthorized } from "./pages/Unauthorized.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx"; // 👈 Import here
import Cookies from "js-cookie";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:5555/logout", {
        withCredentials: true,
      });
      Cookies.remove("token");
      console.log(response.data);
      if (response.status === 200) {
        alert(response.data.message);
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out.");
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/signup"
          element={<SignupPage onLoginSuccess={handleLoginSuccess} />}
        />

        {/* Protected Routes */}
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view"
          element={
            <ProtectedRoute>
              <ViewListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view/:id"
          element={
            <ProtectedRoute>
              <ListingDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/archived"
          element={
            <ProtectedRoute>
              <ArchivedListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <MembersWithListings />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default App;
