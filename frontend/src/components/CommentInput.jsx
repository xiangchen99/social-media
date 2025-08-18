import React, { useState } from "react";
import axios from "axios";

const CommentInput = ({ postId, onCommentAdded }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to comment.");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };

      const res = await axios.post(
        `/api/posts/${postId}/comments`,
        { text },
        config,
      );
      console.log("Comment added:", res.data);
      setText(""); // Clear input
      if (onCommentAdded) {
        onCommentAdded(res.data); // Pass the new comment data back to parent
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || "Failed to add comment.");
        console.error(err.response.data);
      } else {
        setError("Network error or server unavailable. Please try again.");
        console.error(err);
      }
    }
  };

  return (
    <div
      style={{
        marginTop: "15px",
        padding: "10px",
        borderTop: "1px dashed #ddd",
      }}
    >
      <form onSubmit={handleSubmit}>
        <textarea
          name="commentText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          rows="2"
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
          required
        ></textarea>
        <button
          type="submit"
          style={{
            backgroundColor: "#28a745",
            color: "white",
            padding: "8px 12px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "0.9em",
            marginTop: "5px",
          }}
        >
          Add Comment
        </button>
      </form>
      {error && (
        <p style={{ color: "red", marginTop: "5px", fontSize: "0.9em" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default CommentInput;
