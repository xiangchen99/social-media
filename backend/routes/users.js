import express from 'express';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get a user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/users/follow/:id
// @desc    Follow or unfollow a user
// @access  Private
router.put('/follow/:id', auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Cannot follow yourself
    if (req.params.id === req.user.id) {
      return res.status(400).json({ msg: 'You cannot follow yourself' });
    }

    // Check if the current user is already following the target user
    const isFollowing = currentUser.following.some(
      (follow) => follow.user.toString() === req.params.id
    );

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (follow) => follow.user.toString() !== req.params.id
      );
      userToFollow.followers = userToFollow.followers.filter(
        (follower) => follower.user.toString() !== req.user.id
      );
      await currentUser.save();
      await userToFollow.save();
      res.json({ msg: 'User unfollowed' });
    } else {
      // Follow
      currentUser.following.unshift({ user: req.params.id });
      userToFollow.followers.unshift({ user: req.user.id });
      await currentUser.save();
      await userToFollow.save();
      res.json({ msg: 'User followed' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;