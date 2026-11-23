import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/db.js";
import experimentRouter from "./routes/experimentRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URI || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/experiments", experimentRouter);

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "Equilab Backend is running successfully!" });
});

connectDB();

app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});
