import React, { useState } from "react";
import axios from "axios";

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      // Get the token from local storage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to create a post.");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token, // Attach the JWT token
        },
      };

      const res = await axios.post("/api/posts", { text }, config);
      console.log("Post created:", res.data);
      setText(""); // Clear the input field
      if (onPostCreated) {
        onPostCreated(); // Call the callback to refresh the feed
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || "Failed to create post.");
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
        margin: "20px 0",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            name="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            required
            rows="4"
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          ></textarea>
        </div>
        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1em",
          }}
        >
          Post
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default CreatePost;
