import express from "express";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js"; // Import the middleware

const router = express.Router();

// @route   POST /api/posts
// @desc    Create a post
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const newPost = new Post({
      text: req.body.text,
      user: req.user.id,
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
