import express from "express";
import Post from "../models/Post.js";
import auth from "../middleware/auth.js"; // Import the middleware
import Comment from "../models/Comment.js"; // Import the Comment model
import User from '../models/User.js';

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

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username') // 'user' is the field, 'username' is what to retrieve
      .sort({ createdAt: -1 });
      
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked by this user
    const hasLiked = post.likes.some(
      (like) => like.user.toString() === req.user.id
    );

    if (hasLiked) {
      // Unlike the post
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== req.user.id
      );
    } else {
      // Like the post
      post.likes.unshift({ user: req.user.id });
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    // Check if the user trying to delete the post is the owner
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await Post.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts/user/:user_id
// @desc    Get all posts by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.user_id })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    if (!posts) {
      return res.status(404).json({ msg: 'No posts found for this user' });
    }

    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/posts/:post_id/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/:post_id/comments', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = new Comment({
      text: req.body.text,
      user: req.user.id,
      post: req.params.post_id,
    });

    const comment = await newComment.save();
    await comment.populate('user', 'username'); // Populate user for response
    res.status(201).json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/posts/:post_id/comments
// @desc    Get all comments for a post
// @access  Public
router.get('/:post_id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.post_id })
      .populate('user', 'username') // Populate user details for each comment
      .sort({ createdAt: 1 }); // Sort by oldest first

    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/posts/:post_id/comments/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete('/:post_id/comments/:comment_id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.comment_id);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Check if user is the owner of the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized to delete this comment' });
    }

    await Comment.deleteOne({ _id: req.params.comment_id });
    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
