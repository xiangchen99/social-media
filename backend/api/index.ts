import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "../routes/auth.js"; // Import the router
import postsRouter from "../routes/posts.js"; // Import the new router
import usersRouter from "../routes/users.js"; // Import the users router

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Add CORS middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "https://bigbro.xiang-chen.com"], // Your frontend URL,
    credentials: true,
  }),
);

// Middleware for parsing JSON bodies
app.use(express.json());

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI environment variable is not defined");
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Use the authentication router for API routes
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter); // Use the posts router
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
