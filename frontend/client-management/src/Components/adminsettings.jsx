import React, { useState } from 'react'

const AdminSettingsContent = () => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [showImageOptions, setShowImageOptions] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'johndoe01@gmail.com',
    password: '********',
    phone: '+977-9843567890',
    role: 'Admin',
    department: 'Management'
  })

  const [editData, setEditData] = useState({ ...profileData })

  const handleEdit = () => {
    setEditData({ ...profileData })
    setIsEditMode(true)
  }

  const handleSave = () => {
    setProfileData({ ...editData })
    setIsEditMode(false)
    console.log('Profile updated:', editData)
  }

  const handleDiscard = () => {
    setEditData({ ...profileData })
    setIsEditMode(false)
  }

  const handleLogout = () => {
    console.log('Logging out...')
    // Add logout logic here
  }

  if (isEditMode) {
    return (
      <div className="min-h-screen bg-slate-200 p-6 flex items-center justify-center">
        <div className="bg-slate-200 rounded-2xl p-8 w-full max-w-xl relative">
          {/* Back Button */}
          <button
            onClick={handleDiscard}
            className="absolute top-6 left-6 w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center hover:bg-slate-400 transition-colors"
          >
            <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8 mt-8">
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-md">
                <svg className="w-20 h-20 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <button
                onClick={() => setShowImageOptions(!showImageOptions)}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors shadow-lg"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            {/* Image Options Dropdown */}
            {showImageOptions && (
              <div className="mt-3 bg-white rounded-lg shadow-lg py-2 px-4 space-y-2">
                <button className="block w-full text-left text-sm text-slate-700 hover:text-blue-600 transition-colors py-1">
                  Choose From Gallery
                </button>
                <button className="block w-full text-left text-sm text-slate-700 hover:text-blue-600 transition-colors py-1">
                  Click from camera
                </button>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-blue-600 text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-blue-600 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-blue-600 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={editData.password}
                onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="text-right mt-1">
                <button className="text-sm text-blue-600 hover:text-blue-800">Forget password</button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={handleSave}
              className="px-12 py-3 bg-slate-800 text-white rounded-full font-semibold hover:bg-slate-900 transition-colors shadow-md"
            >
              Save
            </button>
            <button
              onClick={handleDiscard}
              className="px-12 py-3 bg-slate-800 text-white rounded-full font-semibold hover:bg-slate-900 transition-colors shadow-md"
            >
              Discard
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-8">Settings</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{profileData.name}</h2>
              <p className="text-slate-600">{profileData.role}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Email</label>
              <p className="text-slate-800">{profileData.email}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Phone</label>
              <p className="text-slate-800">{profileData.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Role</label>
              <p className="text-slate-800">{profileData.role}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Department</label>
              <p className="text-slate-800">{profileData.department}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Password</label>
              <p className="text-slate-800">{profileData.password}</p>
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            onClick={handleEdit}
            className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Edit Profile
          </button>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Account Settings</h3>
          <div className="space-y-4">
            <button className="w-full flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-slate-700 font-medium">Notification Preferences</span>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-slate-700 font-medium">Privacy Settings</span>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button className="w-full flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <span className="text-slate-700 font-medium">Change Password</span>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full p-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-md flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default AdminSettingsContent