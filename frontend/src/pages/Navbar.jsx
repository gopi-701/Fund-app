import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Navbar = ({ isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-zinc-900 text-white p-4 shadow-md fixed top-0 w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link to="/view" className="hover:text-gray-300">
            Chit Ease
          </Link>
        </div>

        {/* Hamburger button for mobile view */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Desktop view */}
        <div className="hidden md:flex space-x-6">
          {isLoggedIn ? (
            <>
              <Link to="/create" className="hover:text-gray-300">
                Create Listing
              </Link>
              <Link to="/archived" className="hover:text-gray-300">
                Archived Listings
              </Link>
              <Link to="/members" className="hover:text-gray-300">
                Members & Listings
              </Link>
              <button onClick={handleLogout} className="hover:text-gray-300">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/signup" className="hover:text-gray-300">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile dropdown */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4">
          {isLoggedIn ? (
            <>
              <Link
                to="/create"
                className="block hover:text-gray-300"
                onClick={toggleMenu}
              >
                Create Listing
              </Link>
              <Link
                to="/archived"
                className="block hover:text-gray-300"
                onClick={toggleMenu}
              >
                Archived Listings
              </Link>
              <Link
                to="/members"
                className="block hover:text-gray-300"
                onClick={toggleMenu}
              >
                Members & Listings
              </Link>
              <button
                className="block hover:text-gray-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="block hover:text-gray-300"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block hover:text-gray-300"
                onClick={toggleMenu}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
