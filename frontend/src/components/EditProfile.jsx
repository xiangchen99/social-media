import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  CircularProgress, 
  IconButton, 
  Tooltip,
  Chip
} from '@mui/material';
import { 
  Camera, 
  User, 
  Save, 
  ArrowLeft, 
  AlertCircle,
  ImageIcon
} from 'lucide-react';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    bio: '',
    profilePicture: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [bioCharCount, setBioCharCount] = useState(0);
  const [previewError, setPreviewError] = useState(false);
  const navigate = useNavigate();

  const { bio, profilePicture } = formData;
  const defaultProfilePic = 'https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?w=360';

  useEffect(() => {
    const fetchCurrentProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Please log in.');
          setLoading(false);
          return;
        }

        const userId = JSON.parse(atob(token.split('.')[1])).user.id;
        const config = {
          headers: {
            'x-auth-token': token,
          },
        };
        
        const res = await axios.get(`/api/users/${userId}`, config);
        const userData = {
          bio: res.data.bio || '',
          profilePicture: res.data.profilePicture || defaultProfilePic,
        };
        
        setFormData(userData);
        setBioCharCount(userData.bio.length);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching current profile:', err);
        setError(err.response?.data?.msg || 'Failed to load profile for editing.');
        setLoading(false);
      }
    };

    fetchCurrentProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'bio') {
      setBioCharCount(value.length);
    }
    
    if (name === 'profilePicture') {
      setPreviewError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You must be logged in to update your profile.');
        setSaving(false);
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
      };

      const res = await axios.put('/api/users/profile', formData, config);
      console.log('Profile updated:', res.data);
      navigate(`/profile/${res.data._id}`);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.msg || 'Failed to update profile.');
        console.error(err.response.data);
      } else {
        setError('Network error or server unavailable. Please try again.');
        console.error(err);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageError = () => {
    setPreviewError(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CircularProgress size={40} className="mb-4" />
            <p className="text-gray-600">Loading profile data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !formData.bio && !formData.profilePicture) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="py-12">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Tooltip title="Go back">
            <IconButton 
              onClick={() => navigate(-1)}
              className="mr-4 hover:bg-white/50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </IconButton>
          </Tooltip>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <User className="h-8 w-8 text-blue-600" />
            Edit Your Profile
          </h1>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl font-semibold">
              Update Your Information
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-blue-200 shadow-lg">
                    <AvatarImage 
                      src={previewError ? defaultProfilePic : (profilePicture || defaultProfilePic)}
                      alt="Profile Preview" 
                      onError={handleImageError}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                      <User className="w-12 h-12" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 rounded-full p-2 shadow-lg">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                <div className="w-full max-w-md">
                  <Label htmlFor="profilePicture" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Profile Picture URL
                  </Label>
                  <Input
                    id="profilePicture"
                    name="profilePicture"
                    type="url"
                    value={profilePicture}
                    onChange={handleChange}
                    placeholder="https://example.com/your-image.jpg"
                    className="mt-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                  {previewError && profilePicture && (
                    <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Unable to load image, using default
                    </p>
                  )}
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself... What are your interests? What do you do?"
                  maxLength={280}
                  rows={4}
                  className="resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Share something interesting about yourself</span>
                  <Chip 
                    label={`${bioCharCount}/280`}
                    size="small"
                    color={bioCharCount > 250 ? "warning" : "primary"}
                    variant="outlined"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <Button 
                  type="submit" 
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 transition-all duration-200 transform hover:scale-105"
                >
                  {saving ? (
                    <>
                      <CircularProgress size={16} className="mr-2 text-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
                
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={saving}
                  className="flex-1 py-3 transition-all duration-200 hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Helper Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Your profile helps others get to know you better in the community
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;