import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Heart,
  MessageCircle,
  Trash2,
  Eye,
  Users,
  UserPlus,
  UserMinus,
  Settings,
  ArrowLeft,
  MapPin,
  Calendar,
} from "lucide-react";
import CommentList from "./CommentList";
import CommentInput from "./CommentInput";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUserId = localStorage.getItem("token")
    ? JSON.parse(atob(localStorage.getItem("token").split(".")[1])).user.id
    : null;
  const [isFollowing, setIsFollowing] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const navigate = useNavigate();

  const fetchUserDetails = useCallback(async () => {
    try {
      const res = await axios.get(`/api/users/${id}`);
      setUser(res.data);
      if (currentUserId && res.data.followers) {
        setIsFollowing(
          res.data.followers.some(
            (follower) => follower.user === currentUserId,
          ),
        );
      } else {
        setIsFollowing(false);
      }
    } catch (err) {
      setError("Failed to fetch user profile.");
      console.error("Error fetching user:", err);
    }
  }, [id, currentUserId]);

  const fetchUserPosts = useCallback(async () => {
    try {
      const res = await axios.get(`/api/posts/user/${id}`);
      setPosts(res.data);
    } catch (err) {
      setError("Failed to fetch user posts.");
      console.error("Error fetching user posts:", err);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchUserDetails(), fetchUserPosts()]).finally(() =>
      setLoading(false),
    );
  }, [id, fetchUserDetails, fetchUserPosts]);

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to like a post.");
        return;
      }

      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      await axios.put(`/api/posts/like/${postId}`, {}, config);
      fetchUserPosts();
    } catch (err) {
      console.error("Error liking post:", err);
      if (err.response) {
        alert(err.response.data.msg || "Failed to like/unlike post.");
      } else {
        alert("Network error. Could not like/unlike post.");
      }
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete a post.");
        return;
      }

      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      await axios.delete(`/api/posts/${postId}`, config);
      fetchUserPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
      if (err.response) {
        alert(err.response.data.msg || "Failed to delete post.");
      } else {
        alert("Network error. Could not delete post.");
      }
    }
  };

  const handleFollowToggle = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to follow/unfollow.");
        return;
      }
      if (currentUserId === id) {
        alert("You cannot follow/unfollow yourself.");
        return;
      }

      const config = {
        headers: {
          "x-auth-token": token,
        },
      };
      const res = await axios.put(`/api/users/follow/${id}`, {}, config);
      setIsFollowing(res.data.isFollowing);
      fetchUserDetails();
    } catch (err) {
      console.error("Error toggling follow:", err);
      if (err.response) {
        alert(err.response.data.msg || "Failed to update follow status.");
      } else {
        alert("Network error. Could not update follow status.");
      }
    }
  };

  const handleCommentToggle = async (postId) => {
    setExpandedComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const handleCommentAdded = () => {
    fetchUserPosts();
  };

  const handleCommentDeleted = () => {
    fetchUserPosts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              Big Brother is loading profile...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button
              onClick={() => window.location.reload()}
              className="w-full mt-4"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              User not found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              This profile doesn't exist or has been removed from surveillance.
            </p>
            <Button asChild>
              <Link to="/feed">Return to Feed</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const defaultProfilePic =
    "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?w=360";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button asChild variant="ghost" size="sm">
              <Link to="/feed">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Feed
              </Link>
            </Button>
            <Badge variant="outline" className="text-sm font-medium">
              <Eye className="w-4 h-4 mr-2" />
              Profile Under Surveillance
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-red-200 dark:border-red-800">
                  <AvatarImage
                    src={user.profilePicture || defaultProfilePic}
                    alt={`${user.username}'s profile`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultProfilePic;
                    }}
                  />
                  <AvatarFallback className="text-2xl font-bold">
                    {user.username?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <Badge
                  variant="secondary"
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Monitored
                </Badge>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    @{user.username}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {user.email}
                  </p>
                  {user.bio && (
                    <p className="text-gray-700 dark:text-gray-200 italic mt-2 max-w-md">
                      "{user.bio}"
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex justify-center md:justify-start space-x-6 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {posts.length}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Posts
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.followers ? user.followers.length : 0}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Followers
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.following ? user.following.length : 0}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Following
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center md:justify-start space-x-4">
                  {currentUserId && currentUserId === id ? (
                    <Button
                      onClick={() => navigate("/edit-profile")}
                      variant="outline"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    currentUserId && (
                      <Button
                        onClick={handleFollowToggle}
                        variant={isFollowing ? "outline" : "default"}
                        className={
                          isFollowing
                            ? "text-red-600 border-red-600 hover:bg-red-50"
                            : ""
                        }
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus className="w-4 h-4 mr-2" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Posts by @{user.username}
            </h2>
            <Badge variant="secondary">
              {posts.length} {posts.length === 1 ? "post" : "posts"}
            </Badge>
          </div>

          {posts.length > 0 ? (
            <div className="space-y-6">
              {posts.map((post) => (
                <Card
                  key={post._id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardContent className="p-6">
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={user.profilePicture || defaultProfilePic}
                            alt={user.username}
                          />
                          <AvatarFallback>
                            {user.username?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            @{user.username}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(post.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Monitored
                      </Badge>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
                      {post.text}
                    </p>

                    {/* Post Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(post._id)}
                        className={`${
                          post.likes.some((like) => like.user === currentUserId)
                            ? "text-red-600 hover:text-red-700"
                            : "text-gray-500 hover:text-red-500"
                        } transition-colors`}
                      >
                        <Heart
                          className={`w-4 h-4 mr-1 ${
                            post.likes.some(
                              (like) => like.user === currentUserId,
                            )
                              ? "fill-current"
                              : ""
                          }`}
                        />
                        {post.likes.length}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCommentToggle(post._id)}
                        className="text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {expandedComments[post._id]
                          ? "Hide Comments"
                          : "View Comments"}
                      </Button>

                      {currentUserId === post.user?._id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(post._id)}
                          className="text-gray-500 hover:text-red-500 transition-colors ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    {/* Comments Section */}
                    {expandedComments[post._id] && (
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <CommentsSectionWrapper
                          postId={post._id}
                          onCommentAdded={handleCommentAdded}
                          onCommentDeleted={handleCommentDeleted}
                          currentUserId={currentUserId}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  @{user.username} hasn't shared anything under Big Brother's
                  surveillance yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component to manage comment state and fetching
const CommentsSectionWrapper = ({
  postId,
  onCommentAdded,
  onCommentDeleted,
  currentUserId,
}) => {
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const res = await axios.get(`/api/posts/${postId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleOptimisticCommentDelete = (deletedCommentId) => {
    setComments((prevComments) =>
      prevComments.filter((comment) => comment._id !== deletedCommentId),
    );
    onCommentDeleted();
  };

  const handleOptimisticCommentAdd = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
    onCommentAdded(newComment);
  };

  if (commentsLoading) {
    return (
      <div className="text-center py-4">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading comments...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CommentList
        comments={comments}
        postId={postId}
        onCommentDeleted={handleOptimisticCommentDelete}
        currentUserId={currentUserId}
      />
      {currentUserId && (
        <CommentInput
          postId={postId}
          onCommentAdded={handleOptimisticCommentAdd}
        />
      )}
    </div>
  );
};

export default Profile;
