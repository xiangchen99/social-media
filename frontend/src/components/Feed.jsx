import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Heart, MessageCircle, Trash2, Eye, Users, Home, ArrowLeft } from 'lucide-react';
import CreatePost from './CreatePost';
import CommentList from './CommentList';
import CommentInput from './CommentInput';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = localStorage.getItem('token') ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).user.id : null;
  const [expandedComments, setExpandedComments] = useState({});

  // Default profile picture URL
  const defaultProfilePic = 'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?w=360';

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
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
      fetchPosts();
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
      fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      if (err.response) {
        alert(err.response.data.msg || 'Failed to delete post.');
      } else {
        alert('Network error. Could not delete post.');
      }
    }
  };

  const fetchCommentsForPost = useCallback(async (postId) => {
    try {
      const res = await axios.get(`/api/posts/${postId}/comments`);
      return res.data;
    } catch (err) {
      console.error('Error fetching comments for post:', postId, err);
      return [];
    }
  }, []);

  const handleCommentToggle = async (postId) => {
    setExpandedComments(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  };

  const handleCommentAdded = (newComment) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post._id === newComment.post
          ? { ...post, comments: post.comments ? [...post.comments, newComment] : [newComment] }
          : post
      )
    );
    if (expandedComments[newComment.post]) {
      fetchPosts();
    }
  };

  const handleCommentDeleted = () => {
    fetchPosts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
              Big Brother is scanning posts...
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
            <Button onClick={fetchPosts} className="w-full mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/homepage">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Home
                </Link>
              </Button>
              <Badge variant="outline" className="text-sm font-medium">
                <Eye className="w-4 h-4 mr-2" />
                Under Surveillance
              </Badge>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                Big Brother
              </span>{' '}
              Feed
            </h1>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Users className="w-4 h-4" />
              <span>{posts.length} posts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Create Post Section */}
        {currentUserId && (
          <div className="mb-8">
            <CreatePost onPostCreated={fetchPosts} />
          </div>
        )}

        {/* Secret Message Card */}
        <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <MessageCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-2" />
              <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                Secret Message Revealed!
              </h3>
            </div>
            <p className="text-yellow-700 dark:text-yellow-300">
              🎉 Congratulations! You've successfully logged into Big Brother Social Media. 
              This is the hidden message I promised you on the homepage: 
            </p>
            <p className="mt-2 text-yellow-800 dark:text-yellow-200 font-semibold">
                "Do you ever feel like a plastic bag?"
            </p>
          </CardContent>
        </Card>

        {/* Posts */}
        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post._id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  {/* Post Header */}
                  {post.user && (
                    <div className="flex items-center mb-4">
                      <Avatar className="w-10 h-10 mr-3 ring-2 ring-gray-200 dark:ring-gray-700">
                        <AvatarImage 
                          src={post.user.profilePicture || defaultProfilePic} 
                          alt={`@${post.user.username}`}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                          {post.user.username?.charAt(0)?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Link 
                          to={`/profile/${post.user._id}`} 
                          className="font-semibold text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          @{post.user.username}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(post.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        Monitored
                      </Badge>
                    </div>
                  )}

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
                        post.likes.some(like => like.user === currentUserId)
                          ? 'text-red-600 hover:text-red-700'
                          : 'text-gray-500 hover:text-red-500'
                      } transition-colors`}
                    >
                      <Heart 
                        className={`w-4 h-4 mr-1 ${
                          post.likes.some(like => like.user === currentUserId) ? 'fill-current' : ''
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
                      {expandedComments[post._id] ? 'Hide Comments' : 'View Comments'}
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
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                The surveillance feed is empty. Be the first to share something!
              </p>
              {currentUserId && (
                <Button onClick={() => window.scrollTo(0, 0)}>
                  Create First Post
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
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
    onCommentDeleted();
  };

  const handleOptimisticCommentAdd = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
    onCommentAdded(newComment);
  };

  if (commentsLoading) {
    return (
      <div className="text-center py-4">
        <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading comments...</p>
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

export default Feed;