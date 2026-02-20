import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
// import jwt_decode from "jwt-decode";

const parseJwt = (token) => {
  try {
    const base64 = token.split(".")[1];
    const json = atob(base64);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

// Helper to check token expiration

const isTokenExpired = (token) => {
  try {
    const { exp } = parseJwt(token);
    return Date.now() >= exp * 1000;
  } catch (err) {
    console.log(err);
    return true;
  }
};

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("token");

  if (!token || isTokenExpired(token)) {
    Cookies.remove("token"); // optional
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
