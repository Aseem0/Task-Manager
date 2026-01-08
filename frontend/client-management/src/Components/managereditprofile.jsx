import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera } from 'lucide-react';

const API_URL = "http://127.0.0.1:8000/api/users/";

const ManagerEditProfile = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}profile/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = {
          username: data.username || '',
          email: data.email || '',
          password: '',
        };
        setFormData(userData);
        setOriginalData(userData);
        // Load avatar from localStorage or backend
        const savedImage = localStorage.getItem('profileImage');
        setProfileImage(savedImage || data.avatar || null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    document.getElementById('edit-profile-image').click();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      // Save profile image to localStorage
      if (profileImage) {
        localStorage.setItem('profileImage', profileImage);
      }

      // Prepare data for API update
      const updateData = {
        username: formData.username,
        email: formData.email,
      };
      
      // Only include password if it was changed
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        alert('Profile saved successfully!');
        navigate('/manager/settings');
      } else {
        const errorData = await response.json();
        setError(errorData.detail || errorData.error || 'Failed to save profile');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      // If API fails, still save image locally and show success for image
      if (profileImage) {
        localStorage.setItem('profileImage', profileImage);
        alert('Profile image saved! Note: Server may be unavailable for other changes.');
        navigate('/manager/settings');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    // Reset to original values
    if (originalData) {
      setFormData(originalData);
    }
    navigate('/manager/settings');
  };

  const handleBack = () => {
    navigate('/manager/settings');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-6">
      <div className="bg-gray-200 rounded-3xl w-full max-w-xl p-8 relative">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="absolute top-8 left-8 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>

        {/* Profile Picture Section */}
        <div className="flex justify-center mb-8 pt-4">
          <input
            id="edit-profile-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          <div className="relative">
            <div
              className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden cursor-pointer shadow-md"
              onClick={triggerFileInput}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-16 h-16 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>

            <button
              onClick={triggerFileInput}
              className="absolute bottom-0 right-0 w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center border-4 border-gray-200 hover:bg-blue-800 transition-colors"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-blue-600 font-medium mb-2 text-sm">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              autoComplete="off"
              className="w-full px-4 py-3 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-blue-600 font-medium mb-2 text-sm">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="off"
              className="w-full px-4 py-3 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-blue-600 font-medium mb-2 text-sm">
              New Password (leave empty to keep current)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
              placeholder="Enter new password"
              className="w-full px-4 py-3 bg-white rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-blue-900 text-white py-3 rounded-xl hover:bg-blue-800 transition-colors font-medium disabled:bg-blue-400"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleDiscard}
            disabled={isSaving}
            className="flex-1 bg-gray-500 text-white py-3 rounded-xl hover:bg-gray-600 transition-colors font-medium"
          >
            Discard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerEditProfile;