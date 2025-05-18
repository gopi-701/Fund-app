import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import userRoutes from "./routes/user.routes.js";
import listingRoutes from "./routes/listing.routes.js";

export const PORT = 5555 || process.env.PORT;
const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(userRoutes);
app.use(listingRoutes);

app.get("/", (req, res) => {
  return res.status(500).send("welcome to chit company");
});

const start = async () => {
  const connectDB = await mongoose
    .connect(
      "mongodb+srv://gpnt12:gMALvdYeO8dn77zG@zerodhaclonecluster.8cwr2pn.mongodb.net/?retryWrites=true&w=majority&appName=ZerodhaCloneCluster",
      {
        dbName: "chit",
      }
    )
    .then(() => {
      // console.log("connected to database");
      app.listen(PORT, () => {
        // console.log(`server is running on port ${PORT}`);
      });
    });
};
start();
