import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import listing from "../models/listing.model.js";
import { createSecretToken } from "../utils/SecretToken.js";

export const register = async (req, res, next) => {
  try {
    const { name, password, username } = req.body;
    if (!name || !password || !username)
      return res.json({ message: "All fields are required" });

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ name, username, password });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
    });

    // Find listings associated with this user (if any)
    const userListings = await listing.find({ userId: user._id });

    // Return success message with user info and their listings
    return res.json({
      message: "User Created",
      success: true,
      user,
    });
    next();
  } catch (error) {
    // console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    // console.log(username, password);
    if (!username || !password)
      return res.status(400).json({ message: "All fields are required" });
    const user = await User.findOne({
      username,
    });
    if (!user) return res.status(404).json({ message: "User does not exist" });
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      // console.log("error");
      return res.json({ message: "Incorrect password or username" });
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      // httpOnly: true,
    });
    res
      .status(201)
      .json({ message: "User logged in successfully", success: true });
  } catch (error) {
    console.error(error);
  }
};
export const logout = async (req, res) => {
  try {
    // Clear the token cookie on the server-side
    res.cookie("token", "", {
      httpOnly: true, // Make sure it's inaccessible via JS
      expires: new Date(0), // Set expiration date to the past to delete it
      secure: process.env.NODE_ENV === "production", // Secure only in production
      sameSite: "Strict", // Restrict cross-site requests
      path: "/", // Ensure it applies to the entire domain
    });

    return res.json({ status: true, message: "Logged out successfully!" });
  } catch (error) {
    console.error("Logout error:", error);
    return res
      .status(500)
      .json({ message: "Logout failed", error: error.message });
  }
};
