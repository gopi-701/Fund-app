import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create a context for authentication
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const navigate = useNavigate();

  // Check if the user is logged in using token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // User is authenticated, fetch user data
      axios
        .get("/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUserData(response.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setIsGuest(true);
        });
    } else {
      // User is a guest
      setIsGuest(true);
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post("/api/user/login", {
        username,
        password,
      });
      localStorage.setItem("token", response.data.token); // Store token
      setUserData(response.data.user);
      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      console.log(error);
    }
  };
  const handleRegister = async (name, username, password) => {
    try {
      const response = await axios.post("/api/user/register", {
        name,
        username,
        password,
      });
      localStorage.setItem("token", response.data.token); // Store token
      setUserData(response.data.user);
      navigate("/dashboard"); // Redirect after login
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setIsGuest(true);
    navigate("/login");
  };

  const data = {
    userData,
    isGuest,
    handleLogin,
    handleLogout,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
