import React, { useState } from 'react'

const AdminNotification = ({ isOpen, onClose }) => {
  const [activeFilter, setActiveFilter] = useState('All')
  
  const notifications = [
    {
      id: 1,
      message: "Aastha has completed task 'UI Design'.",
      time: '30 min ago',
      isRead: false
    },
    {
      id: 2,
      message: "Task 'API Integration' is due within 24 hrs.",
      time: '12 hrs ago',
      isRead: false
    },
    {
      id: 3,
      message: "Task 'UI Design' has been updated.",
      time: '1 day ago',
      isRead: false
    }
  ]

  const handleMarkAllRead = () => {
    console.log('Mark all as read')
    // Add your logic here
  }

  if (!isOpen) return null

  return (
    <div className="absolute top-16 right-4 w-96 bg-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
      {/* Header with search */}
      <div className="bg-slate-800 p-4">
        <div className="flex items-center space-x-2 bg-slate-700 rounded-lg px-4 py-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search..."
            className="bg-transparent text-white placeholder-gray-400 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* Arrow pointing up */}
      <div className="absolute top-0 right-8 transform -translate-y-1/2">
        <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-slate-100"></div>
      </div>

      {/* Filter tabs */}
      <div className="bg-slate-100 px-4 pt-4">
        <div className="flex space-x-1 mb-4">
          <button
            onClick={() => setActiveFilter('All')}
            className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
              activeFilter === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter('Unread')}
            className={`px-6 py-2 rounded-t-lg font-medium transition-colors ${
              activeFilter === 'Unread'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            Unread
          </button>
          <div className="flex-1"></div>
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications list */}
        <div className="bg-white rounded-lg shadow-sm max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start justify-between p-4 border-b border-slate-200 last:border-b-0 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-2 h-2 bg-slate-800 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-slate-800 text-sm">{notification.message}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500 ml-4 whitespace-nowrap">{notification.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminNotification