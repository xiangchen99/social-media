import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get('/api/posts');
        setPosts(res.data);
      } catch (err) {
        setError('Failed to fetch posts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // The empty array ensures this runs only once when the component mounts

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Public Feed</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post._id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <p><strong>{post.user?.username}</strong></p>
            <p>{post.text}</p>
            <p style={{ fontSize: '0.8em', color: '#666' }}>
              Posted on: {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p>No posts to display. Be the first to create one!</p>
      )}
    </div>
  );
};

export default Feed;