import React, { useState, useEffect } from "react";
import { X, Plus, Edit2, Trash2, Search, SlidersHorizontal } from "lucide-react";
import { signup } from "../Services/auth";

const API_URL = "http://127.0.0.1:8000/api/users/";

// Helper function to refresh access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    window.location.href = "/";
    return null;
  }
  const response = await fetch(`${API_URL}token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("accessToken", data.access);
    return data.access;
  }
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/";
  return null;
};

// Helper function for authenticated API calls
const fetchWithAuth = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    // Try to refresh token
    accessToken = await refreshAccessToken();
    if (accessToken) {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });
    }
  }
  return response;
};

const AdminManagers = () => {
  const [managers, setManagers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingManager, setEditingManager] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "manager",
  });

  // Fetch managers from backend on component mount
  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(`${API_URL}employees/`);
      if (response.ok) {
        const data = await response.json();
        // Filter to only show managers
        const managersOnly = data.filter((user) => user.role === 'manager');
        setManagers(managersOnly);
      } else {
        console.error("Failed to fetch managers");
        setManagers([]);
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
      setError("Failed to fetch managers");
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "manager",
    });
    setEditingManager(null);
    setError("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const openEditModal = (manager) => {
    setFormData({
      username: manager.username,
      email: manager.email,
      password: "",
      role: "manager",
    });
    setEditingManager(manager);
    setError("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  const handleDeleteManager = async (managerId) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(`${API_URL}employees/${managerId}/`, {
        method: "DELETE",
      });
      
      if (response.status === 204 || response.ok) {
        setManagers(managers.filter((m) => m.id !== managerId));
        alert("Manager deleted successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to delete manager");
      }
    } catch (error) {
      console.error("Error deleting manager:", error);
      setError("Failed to delete manager");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const isEditing = editingManager !== null;
    
    if (!formData.username || !formData.email) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (!isEditing && !formData.password) {
      setError("Password is required for new managers");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (isEditing) {
        // UPDATE existing manager
        const updateData = {
          username: formData.username,
          email: formData.email,
          role: "manager",
        };
        
        if (formData.password && formData.password.trim() !== "") {
          updateData.password = formData.password;
        }

        const response = await fetchWithAuth(`${API_URL}employees/${editingManager.id}/`, {
          method: "PUT",
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          setSuccessMessage("Manager updated successfully!");
          setTimeout(() => {
            setIsModalOpen(false);
            fetchManagers();
          }, 1500);
        } else {
          const errorData = await response.json();
          setError(errorData.detail || "Failed to update manager");
        }
      } else {
        // ADD new manager
        const response = await signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: "manager",
        });

        if (response.message && response.message.toLowerCase().includes("successfully")) {
          setSuccessMessage("Manager added successfully!");
          setTimeout(() => {
            setIsModalOpen(false);
            fetchManagers();
          }, 1500);
        } else {
          setError(response.error || response.detail || "Failed to add manager");
        }
      }
    } catch (error) {
      console.error("Error saving manager:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredManagers = managers.filter(
    (m) =>
      m.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="bg-slate-100 rounded-2xl p-6 min-h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800">Managers</h1>
          <button 
            onClick={openAddModal}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Add Manager</span>
          </button>
        </div>

        {/* Filter and Search */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-slate-200">
            <SlidersHorizontal className="w-5 h-5 text-slate-400" />
            <span className="text-slate-600 font-medium">Filter: All</span>
          </div>

          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm border border-slate-200">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="search"
              placeholder="Search managers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-slate-600 placeholder-slate-400 focus:outline-none w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isLoading && managers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-500">Loading managers...</td>
                  </tr>
                ) : filteredManagers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-slate-500">No managers found</td>
                  </tr>
                ) : (
                  filteredManagers.map((manager) => (
                    <tr key={manager.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">{manager.username}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{manager.email}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold uppercase">
                          {manager.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center space-x-4">
                          <button 
                            onClick={() => openEditModal(manager)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteManager(manager.id)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingManager ? 'Edit Manager' : 'Add New Manager'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="p-3 bg-green-50 border border-green-100 text-green-600 rounded-lg text-sm font-medium">
                  {successMessage}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                <input
                  type="text"
                  name="manager_username_new"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter username"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  name="manager_email_new"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter email"
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Password {editingManager && <span className="text-slate-400 font-normal">(leave empty if unchanged)</span>}
                </label>
                <input
                  type="password"
                  name="manager_password_new"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder={editingManager ? "New password" : "Enter password"}
                  autoComplete="new-password"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : editingManager ? 'Update' : 'Add Manager'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagers;