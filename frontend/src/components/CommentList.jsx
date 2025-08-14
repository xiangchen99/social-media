import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CommentList = ({ comments, postId, onCommentDeleted, currentUserId }) => {

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to delete a comment.');
        return;
      }

      const config = {
        headers: {
          'x-auth-token': token,
        },
      };
      // Send delete request to the specific comment endpoint
      await axios.delete(`/api/posts/${postId}/comments/${commentId}`, config);
      if (onCommentDeleted) {
        onCommentDeleted(commentId); // Notify parent to refresh comments
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      if (err.response) {
        alert(err.response.data.msg || 'Failed to delete comment.');
      } else {
        alert('Network error. Could not delete comment.');
      }
    }
  };

  return (
    <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
      <h4 style={{ marginBottom: '10px', color: '#555' }}>Comments:</h4>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment._id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '8px', borderRadius: '5px', backgroundColor: '#fafafa', position: 'relative' }}>
            <p style={{ fontSize: '0.9em', marginBottom: '5px' }}>
              <Link to={`/profile/${comment.user._id}`} style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                @{comment.user.username}
              </Link>
              <span style={{ color: '#888', marginLeft: '10px', fontSize: '0.8em' }}>
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </p>
            <p style={{ fontSize: '1em' }}>{comment.text}</p>
            {currentUserId === comment.user._id && ( // Only show delete button if current user owns the comment
              <button
                onClick={() => handleDeleteComment(comment._id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '5px 8px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '0.75em'
                }}
              >
                Delete
              </button>
            )}
          </div>
        ))
      ) : (
        <p style={{ fontSize: '0.9em', color: '#888' }}>No comments yet. Be the first to comment!</p>
      )}
    </div>
  );
};

export default CommentList;
