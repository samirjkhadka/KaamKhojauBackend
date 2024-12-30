import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const app = express();
dotenv.config();

const port = process.env.PORT || 5000;
connectDB();
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000"];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(cookieParser());

//error middleware

app.use(errorMiddleware);

//API Endpoints

app.get("/", (req, res) => {
  res.send("Kaam Khojau V2 API IS RUNNING !");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
