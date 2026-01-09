import React, { useState } from 'react'
import AdminNotification from './adminnotification.jsx'
import { NavLink, Outlet } from 'react-router-dom'

const AdminLayout = ({ children, activeTab = 'Dashboard', setActiveTab }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  
  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Analytics', icon: '📈' },
    { name: 'Projects', icon: '📁' },
    { name: 'Tasks', icon: '✓' },
    { name: 'Clients', icon: '👤' },
    { name: 'Settings', icon: '⚙️' }
  ]

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <div className="bg-slate-800 text-white w-64 min-h-screen p-4">
        <div className="mb-8">
          <h1 className="text-xl font-bold">ClientX</h1>
        </div>

        <nav className="space-y-2">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `block items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="analytics"
            className={({ isActive }) =>
              `block items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Analytics
          </NavLink>
          <NavLink
            to="project"
            className={({ isActive }) =>
              `block items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Project
          </NavLink>
          <NavLink
            to="tasks"
            className={({ isActive }) =>
              `block items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Tasks
          </NavLink>
          <NavLink
            to="clients"
            className={({ isActive }) =>
              `block items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Clients
          </NavLink>
          <NavLink
            to="settings"
            className={({ isActive }) =>
              `block items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-slate-700 text-white"
                  : "text-gray-300 hover:bg-slate-700 hover:text-white"
              }`
            }
          >
            Settings
          </NavLink>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
          <div>
            <h2 className="text-xl font-semibold">ClientX</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="search"
                placeholder="Search..."
                className="bg-slate-800 text-white px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 hover:bg-slate-800 rounded-md transition-colors relative"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors">
                <span className="text-sm font-medium">A</span>
              </button>
            </div>
          </div>
        </header>

        {/* Notification Dropdown */}
        <AdminNotification isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-slate-100">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-blue-900 text-white p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
              <div>
                <h3 className="text-xl font-bold mb-4">ClientX</h3>
                <p className="text-blue-200 text-sm mb-4">
                  ClientX is a Task Management System to help Manage Client's Project And Tasks.
                </p>
                <div className="flex space-x-3">
                  <a href="#" className="w-9 h-9 bg-blue-800 rounded flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <span className="text-sm">f</span>
                  </a>
                  <a href="#" className="w-9 h-9 bg-orange-500 rounded flex items-center justify-center hover:bg-orange-600 transition-colors">
                    <span className="text-sm">@</span>
                  </a>
                  <a href="#" className="w-9 h-9 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 transition-colors">
                    <span className="text-sm">X</span>
                  </a>
                  <a href="#" className="w-9 h-9 bg-blue-700 rounded flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <span className="text-sm">in</span>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-lg">Company</h4>
                <ul className="space-y-2 text-blue-200 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Join Us</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
                <ul className="space-y-2 text-blue-200 text-sm">
                  <li className="flex items-center space-x-2">
                    <span>📧</span>
                    <span>Client12320@Gmail.Com</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>📞</span>
                    <span>977-9843567890</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span>📍</span>
                    <span>Syanja Chowk, Pokhara-8, Kaski</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-blue-800 pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-blue-200">
              <p className="mb-2 md:mb-0">© https://copyright.com</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default AdminLayout