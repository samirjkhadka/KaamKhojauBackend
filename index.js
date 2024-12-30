import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;
connectDB();
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());

//API Endpoints

app.get("/", (req, res) => {
  res.send("Kaam Khojau V2 API IS RUNNING !");
});
// app.use("/api-v1/auth", authRouter);
// app.use("/api-v1/user", userRouter);
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
