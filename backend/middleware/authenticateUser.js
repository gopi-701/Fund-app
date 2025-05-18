import User from "../models/user.model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token; // Assuming you're storing the token in cookies
  // console.log(token);

  if (!token) {
    // console.log("not able to find");
    return res.status(500).json({ message: "You'll have to login" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      // console.log(err);
      return res.json({ status: false });
    } else {
      // Find the user by the id decoded from the token
      const user = await User.findById(data.id);

      if (user) {
        // console.log("yes user");
        req.user = user;
        next();
      } else {
        return res.json({ status: false });
      }
    }
  });
};
