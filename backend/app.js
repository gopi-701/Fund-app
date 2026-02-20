import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import listingRoutes from "./routes/listing.routes.js";

export const PORT = process.env.PORT || 3000;
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(userRoutes);
app.use(listingRoutes);

app.get("/", (req, res) => {
  return res.status(500).send("welcome to chit company");
});

const connectDB = () => {
  return mongoose.connect(process.env.MONGO_URI, { dbName: "chit" });
};

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
