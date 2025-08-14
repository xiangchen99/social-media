import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CreatePost from './CreatePost';
import CommentList from './CommentList'; // Import CommentList
import CommentInput from './CommentInput'; // Import CommentInput

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).user.id : null;
  const [expandedComments, setExpandedComments] = useState({}); // State to track which post's comments are open


  // useCallback to memoize fetchPosts to prevent unnecessary re-renders in useEffect
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/posts');
      setPosts(res.data);
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, so it only re-creates if nothing changes

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]); // Rerun when fetchPosts changes

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to like a post.');
        return;
      }

      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.put(`/api/posts/like/${postId}`, {}, config);
      fetchPosts(); // Refresh posts to show updated likes
    } catch (err) {
      console.error('Error liking post:', err);
      if (err.response) {
        alert(err.response.data.msg || 'Failed to like/unlike post.');
      } else {
        alert('Network error. Could not like/unlike post.');
      }
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to delete a post.');
        return;
      }

      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      await axios.delete(`/api/posts/${postId}`, config);
      fetchPosts(); // Refresh posts to remove the deleted one
    } catch (err) {
      console.error('Error deleting post:', err);
      if (err.response) {
        alert(err.response.data.msg || 'Failed to delete post.');
      } else {
        alert('Network error. Could not delete post.');
      }
    }
  };

  // New functions for comments
  const fetchCommentsForPost = useCallback(async (postId) => {
    try {
      const res = await axios.get(`/api/posts/${postId}/comments`);
      return res.data;
    } catch (err) {
      console.error('Error fetching comments for post:', postId, err);
      return []; // Return empty array on error
    }
  }, []);

  const handleCommentToggle = async (postId) => {
    setExpandedComments(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  const handleCommentAdded = (newComment) => {
    // Optimistically update the comments for the specific post
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === newComment.post
          ? { ...post, comments: post.comments ? [...post.comments, newComment] : [newComment] }
          : post
      )
    );
    // Re-fetch comments if the section is open to ensure accurate count/display
    if (expandedComments[newComment.post]) {
        fetchPosts(); // A full refetch of posts will ensure comment counts are updated too
    }
  };

  const handleCommentDeleted = () => {
      fetchPosts(); // A full refetch of posts will ensure comment counts are updated too
  };


  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>Loading posts...</div>;
  }

  if (error) {
    return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1>Public Feed</h1>
      {currentUserId && <CreatePost onPostCreated={fetchPosts} />} {/* Render CreatePost if logged in */}

      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} style={{ border: '1px solid #ddd', margin: '15px 0', padding: '15px', borderRadius: '8px', backgroundColor: 'white', position: 'relative' }}>
            {post.user && (
              <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                <Link to={`/profile/${post.user._id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
                  @{post.user.username}
                </Link>
              </p>
            )}
            <p style={{ fontSize: '1.1em', lineHeight: '1.5' }}>{post.text}</p>
            <p style={{ fontSize: '0.8em', color: '#666', marginTop: '10px' }}>
              Posted on: {new Date(post.createdAt).toLocaleString()}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
              <button
                onClick={() => handleLike(post._id)}
                style={{
                  backgroundColor: post.likes.some(like => like.user === currentUserId) ? '#dc3545' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: '10px'
                }}
              >
                <span style={{ marginRight: '5px' }}>❤️</span> {post.likes.length}
              </button>
              {currentUserId === post.user?._id && (
                <button
                  onClick={() => handleDelete(post._id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              )}
               <button
                onClick={() => handleCommentToggle(post._id)}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '0.9em',
                  marginLeft: 'auto' // Push to the right
                }}
              >
                {expandedComments[post._id] ? 'Hide Comments' : 'View Comments'}
              </button>
            </div>
            {expandedComments[post._id] && (
              <div style={{ marginTop: '15px' }}>
                {/* We'll pass fetchCommentsForPost here to get comments dynamically */}
                <CommentsSectionWrapper postId={post._id} onCommentAdded={handleCommentAdded} onCommentDeleted={handleCommentDeleted} currentUserId={currentUserId} />
              </div>
            )}
          </div>
        ))
      ) : (
        <p style={{ textAlign: 'center', color: '#888' }}>No posts to display. Be the first to create one!</p>
      )}
    </div>
  );
};

// Helper component to manage comment state and fetching
const CommentsSectionWrapper = ({ postId, onCommentAdded, onCommentDeleted, currentUserId }) => {
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const res = await axios.get(`/api/posts/${postId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleOptimisticCommentDelete = (deletedCommentId) => {
    setComments(prevComments => prevComments.filter(comment => comment._id !== deletedCommentId));
    onCommentDeleted(); // Notify parent to potentially re-fetch if needed for accurate counts
  };

  const handleOptimisticCommentAdd = (newComment) => {
    // Add the newly created comment to the list
    setComments(prevComments => [...prevComments, newComment]);
    onCommentAdded(newComment); // Notify parent to update count or overall post
  };

  if (commentsLoading) {
    return <div style={{ textAlign: 'center', padding: '10px', fontSize: '0.9em' }}>Loading comments...</div>;
  }

  return (
    <>
      <CommentList comments={comments} postId={postId} onCommentDeleted={handleOptimisticCommentDelete} currentUserId={currentUserId} />
      {currentUserId && <CommentInput postId={postId} onCommentAdded={handleOptimisticCommentAdd} />}
    </>
  );
};

export default Feed;
