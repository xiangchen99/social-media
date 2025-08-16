    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { useNavigate } from 'react-router-dom';

    const EditProfile = () => {
      const [formData, setFormData] = useState({
        bio: '',
        profilePicture: '',
      });
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const navigate = useNavigate();

      const { bio, profilePicture } = formData;

      useEffect(() => {
        const fetchCurrentProfile = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              setError('No token found. Please log in.');
              setLoading(false);
              return;
            }

            // Decode token to get current user's ID
            const userId = JSON.parse(atob(token.split('.')[1])).user.id;

            const config = {
              headers: {
                'x-auth-token': token,
              },
            };
            // Fetch current user's profile to pre-fill the form
            const res = await axios.get(`/api/users/${userId}`, config);
            setFormData({
              bio: res.data.bio || '',
              profilePicture: res.data.profilePicture || '',
            });
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setError('You must be logged in to update your profile.');
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
          navigate(`/profile/${res.data._id}`); // Navigate back to the user's profile page
        } catch (err) {
          if (err.response) {
            setError(err.response.data.msg || 'Failed to update profile.');
            console.error(err.response.data);
          } else {
            setError('Network error or server unavailable. Please try again.');
            console.error(err);
          }
        }
      };

      if (loading) {
        return <div style={{ textAlign: 'center', padding: '20px' }}>Loading profile data...</div>;
      }

      if (error) {
        return <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>;
      }

      return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h1>Edit Your Profile</h1>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="bio" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bio</label>
              <textarea
                id="bio"
                name="bio"
                value={bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows="4"
                maxLength="280"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              ></textarea>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="profilePicture" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Profile Picture URL</label>
              <input
                type="text"
                id="profilePicture"
                name="profilePicture"
                value={profilePicture}
                onChange={handleChange}
                placeholder="e.g., https://example.com/your-image.jpg"
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
              />
              {profilePicture && (
                <img
                  src={profilePicture}
                  alt="Profile Preview"
                  style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginTop: '10px', border: '1px solid #ddd' }}
                  onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/100x100/A0B0C0/FFFFFF?text=P'; }} // Fallback on error
                />
              )}
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1em',
                marginRight: '10px'
              }}
            >
              Save Profile
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)} // Go back to previous page
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '1em'
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      );
    };

    export default EditProfile;
    