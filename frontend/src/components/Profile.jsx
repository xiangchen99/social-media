    import React, { useState, useEffect, useCallback } from 'react';
    import axios from 'axios';
    import { useParams, Link, useNavigate } from 'react-router-dom'; // Import useNavigate
    import CommentList from './CommentList';
    import CommentInput from './CommentInput';


    const Profile = () => {
      const { id } = useParams(); // Get the user ID from the URL parameter
      const [user, setUser] = useState(null);
      const [posts, setPosts] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);

      const currentUserId = localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).user.id : null;
      const [isFollowing, setIsFollowing] = useState(false); // New state for follow status
      const [expandedComments, setExpandedComments] = useState({}); // State to track which post's comments are open
      const navigate = useNavigate(); // Initialize useNavigate


      // Function to fetch user details
      const fetchUserDetails = useCallback(async () => {
        try {
          const res = await axios.get(`/api/users/${id}`);
          setUser(res.data);
          // Set initial follow status
          if (currentUserId && res.data.followers) {
            setIsFollowing(res.data.followers.some(follower => follower.user._id === currentUserId));
          } else {
            setIsFollowing(false);
          }
        } catch (err) {
          setError('Failed to fetch user profile.');
          console.error('Error fetching user:', err);
        }
      }, [id, currentUserId]);

      // Function to fetch user's posts
      const fetchUserPosts = useCallback(async () => {
        try {
          const res = await axios.get(`/api/posts/user/${id}`);
          setPosts(res.data);
        } catch (err) {
          setError('Failed to fetch user posts.');
          console.error('Error fetching user posts:', err);
        }
      }, [id]);

      useEffect(() => {
        setLoading(true);
        // Fetch both user details and posts concurrently
        Promise.all([fetchUserDetails(), fetchUserPosts()])
          .finally(() => setLoading(false));
      }, [id, fetchUserDetails, fetchUserPosts]); // Re-run when ID or fetch functions change

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
          fetchUserPosts(); // Refresh posts to show updated likes
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
          fetchUserPosts(); // Refresh posts to remove the deleted one
        } catch (err) {
          console.error('Error deleting post:', err);
          if (err.response) {
            alert(err.response.data.msg || 'Failed to delete post.');
          } else {
            alert('Network error. Could not delete post.');
          }
        }
      };

      // Handler for follow/unfollow
      const handleFollowToggle = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            alert('You must be logged in to follow/unfollow.');
            return;
          }
          if (currentUserId === id) {
              alert("You cannot follow/unfollow yourself.");
              return;
          }

          const config = {
            headers: {
              'x-auth-token': token,
            },
          };
          const res = await axios.put(`/api/users/follow/${id}`, {}, config);
          // Optimistically update isFollowing state based on response
          setIsFollowing(res.data.isFollowing);
          fetchUserDetails(); // Refresh user details to update follow counts
        } catch (err) {
          console.error('Error toggling follow:', err);
          if (err.response) {
            alert(err.response.data.msg || 'Failed to update follow status.');
          } else {
            alert('Network error. Could not update follow status.');
          }
        }
      };

      // New functions for comments
      const handleCommentToggle = async (postId) => {
        setExpandedComments(prevState => ({
          ...prevState,
          [postId]: !prevState[postId]
        }));
      };

      const handleCommentAdded = () => {
          fetchUserPosts(); // Re-fetch user posts to ensure comment counts are updated
      };

      const handleCommentDeleted = () => {
          fetchUserPosts(); // Re-fetch user posts to ensure comment counts are updated
      };


      if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Loading profile...</div>;
      }

      if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>;
      }

      if (!user) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>User not found.</div>;
      }

      return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img
              src={user.profilePicture}
              alt={`${user.username}'s profile`}
              style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #007bff', marginBottom: '15px' }}
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/120x120/A0B0C0/FFFFFF?text=P'; }} // Fallback on error
            />
            <h1 style={{ marginBottom: '10px' }}>{user.username}'s Profile</h1>
            <p style={{ color: '#555' }}>{user.email}</p>
            {user.bio && <p style={{ fontStyle: 'italic', margin: '10px 0' }}>"{user.bio}"</p>} {/* Display bio */}
            <p style={{ color: '#555' }}>Followers: {user.followers ? user.followers.length : 0}</p>
            <p style={{ color: '#555' }}>Following: {user.following ? user.following.length : 0}</p>

            {currentUserId && currentUserId === id ? ( // Show edit button if it's the current user's profile
                <button
                    onClick={() => navigate('/edit-profile')}
                    style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        padding: '10px 15px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1em',
                        marginTop: '15px'
                    }}
                >
                    Edit Profile
                </button>
            ) : ( // Show follow/unfollow button if not own profile
              currentUserId && ( // Only show button if logged in
                <button
                  onClick={handleFollowToggle}
                  style={{
                    backgroundColor: isFollowing ? '#f44336' : '#007bff',
                    color: 'white',
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1em',
                    marginTop: '15px'
                  }}
                >
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )
            )}
          </div>

          <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Posts by {user.username}</h2>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} style={{ border: '1px solid #ddd', margin: '15px 0', padding: '15px', borderRadius: '8px', backgroundColor: 'white', position: 'relative' }}>
                {/* Note: In profile, post.user is already the profile owner, so no link needed */}
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
                      marginLeft: 'auto'
                    }}
                  >
                    {expandedComments[post._id] ? 'Hide Comments' : 'View Comments'}
                  </button>
                </div>
                {expandedComments[post._id] && (
                  <div style={{ marginTop: '15px' }}>
                    <CommentsSectionWrapper postId={post._id} onCommentAdded={handleCommentAdded} onCommentDeleted={handleCommentDeleted} currentUserId={currentUserId} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', color: '#888' }}>{user.username} has no posts yet.</p>
          )}
        </div>
      );
    };

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
        onCommentDeleted();
      };

      const handleOptimisticCommentAdd = (newComment) => {
        setComments(prevComments => [...prevComments, newComment]);
        onCommentAdded(newComment);
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

    export default Profile;
    