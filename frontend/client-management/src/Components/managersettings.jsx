import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const API_URL = "http://127.0.0.1:8000/api/users/";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: '',
    role: '',
    avatar: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data on component mount
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
        setUserData({
          username: data.username || '',
          role: data.role || '',
          avatar: data.avatar || localStorage.getItem('profileImage') || null,
        });
      } else {
        // Try to get from localStorage as fallback
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
          setUserData(prev => ({ ...prev, avatar: savedImage }));
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Try to get from localStorage as fallback
      const savedImage = localStorage.getItem('profileImage');
      if (savedImage) {
        setUserData(prev => ({ ...prev, avatar: savedImage }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to log out?')) {
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Redirect to login
      window.location.href = '/login';
    }
  };

  const handleEditProfile = () => {
    navigate('/manager/editprofile');
  };

  // Capitalize first letter of role
  const formatRole = (role) => {
    if (!role) return '';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-lg w-full max-w-md p-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            {/* Avatar - Display only, no upload */}
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {userData.avatar ? (
                <img 
                  src={userData.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>

          {/* Name and Role - Fetched from backend */}
          {isLoading ? (
            <>
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mb-4"></div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{userData.username || 'User'}</h2>
              <p className="text-gray-600 text-sm mb-4">{formatRole(userData.role)}</p>
            </>
          )}

          {/* Edit Profile Button */}
          <button 
            onClick={handleEditProfile}
            className="bg-blue-900 text-white px-8 py-2.5 rounded-lg hover:bg-blue-800 transition-colors font-medium"
          >
            Edit Profile
          </button>
        </div>

        {/* Log Out Button */}
        <div>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 hover:bg-gray-200 transition-colors rounded-xl px-6 py-4 flex items-center justify-between group"
          >
            <span className="text-gray-800 font-medium">Log Out</span>
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;