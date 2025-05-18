import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";

const Signup = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    name: "",
    password: "",
    username: "",
  });
  const { name, password, username } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      navigate("/view");
      onLoginSuccess();
    }
  }, [navigate]);

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:5555/register",
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      const { success, message } = data;
      if (success) {
        try {
          const { data } = await axios.post(
            "http://localhost:5555/login",
            {
              username,
              password,
            },
            { withCredentials: true }
          );
          console.log(data);
          const { success, message } = data;
          if (success) {
            handleSuccess(message);
            onLoginSuccess();
            setTimeout(() => {
              navigate("/view");
            }, 1000);
          } else {
            handleError(message);
          }
        } catch (error) {
          handleError(error);
          console.log(error);
        }
      } else {
        handleError(message);
      }
    } catch (error) {
      handleError(error);
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      name: "",
      password: "",
      username: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {" "}
      {/* Added p-4 for padding on small screens */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Signup Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text" // Changed from type="name" to type="text"
              id="name"
              name="name"
              value={name}
              placeholder="Enter your name"
              onChange={handleOnChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={handleOnChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Submit
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Login
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Signup;
