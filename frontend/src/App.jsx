import { useState, useEffect } from "react";
import { Routes, BrowserRouter as Router, Route, Outlet } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import CreateListing from "./pages/CreateListing.jsx";
import ViewListings from "./pages/ViewListing.jsx";
import DashboardAnalytics from "./pages/DashboardAnalytics.jsx";
import "./App.css";
import ListingDetail from "./pages/ListingDetail.jsx";
import ArchivedListings from "./pages/Archived.jsx";
import Navbar from "./pages/Navbar.jsx";
import MembersWithListings from "./pages/Members.jsx";
import LandingPage from "./pages/Landing.jsx";
import LoginPage from "./pages/Login.jsx";
import SignupPage from "./pages/SignUp.jsx";
import { Unauthorized } from "./pages/Unauthorized.jsx";
import ProtectedRoute from "./pages/ProtectedRoute.jsx"; 
import DashboardPreview from "./pages/DashboardPreview.jsx";

import Cookies from "js-cookie";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
      <Routes>
        {/* Public Routes with Navbar */}
        <Route element={<><Navbar isLoggedIn={isLoggedIn} /><Outlet /></>}>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/signup"
              element={<SignupPage onLoginSuccess={handleLoginSuccess} />}
            />
        </Route>

        {/* Protected Routes with Dashboard Layout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            </ProtectedRoute>
          }
        >
          <Route path="/view" element={<ViewListings />} />
          <Route path="/dashboard" element={<DashboardAnalytics />} />
          <Route path="/create" element={<CreateListing />} />
          <Route path="/view/:id" element={<ListingDetail />} />
          <Route path="/archived" element={<ArchivedListings />} />
          <Route path="/members" element={<MembersWithListings />} />
        </Route>

        {/* Preview Route - Remove later */}
        <Route path="/dashboard-preview" element={<DashboardPreview />} />


        {/* Catch-all */}
        <Route path="*" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
};

export default App;
