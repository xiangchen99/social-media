import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from "./routes/auth.js"; // Import the router
import postsRouter from './routes/posts.js'; // Import the new router

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use the authentication router for API routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postsRouter); // Use the posts router

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});