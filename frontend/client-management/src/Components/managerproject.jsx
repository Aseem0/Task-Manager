import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, X } from "lucide-react";

// API Base URL - Change this to your backend URL
const API_BASE_URL = "http://127.0.0.1:8000/api/tasks";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("accessToken"); // Matches your login code
};

// Helper function to refresh token
const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    window.location.href = "/login";
    return null;
  }

  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/users/token/refresh/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.access);
      return data.access;
    } else {
      // Refresh token is also expired, redirect to login
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
      return null;
    }
  } catch (error) {
    console.error("Error refreshing token:", error);
    window.location.href = "/login";
    return null;
  }
};

// Helper function to make authenticated API calls with auto-refresh
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // If token expired, refresh and retry
  if (response.status === 401) {
    const newToken = await refreshAuthToken();
    if (newToken) {
      // Retry with new token
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
          "Content-Type": "application/json",
        },
      });
    }
  }

  return response;
};

// Modal Component for Create/Edit Task Group
const TaskGroupModal = ({
  isOpen,
  onClose,
  onSubmit,
  editGroup = null,
  employees,
}) => {
  const [formData, setFormData] = useState({
    name: editGroup?.name || "",
    members: editGroup?.members?.map((m) => m.id || m) || [],
  });

  useEffect(() => {
    if (editGroup) {
      setFormData({
        name: editGroup.name,
        members: editGroup.members?.map((m) => m.id || m) || [],
      });
    } else {
      setFormData({ name: "", members: [] });
    }
  }, [editGroup]);

  const handleSubmit = () => {
    if (formData.name.trim()) {
      onSubmit(formData);
      setFormData({ name: "", members: [] });
    }
  };

  const toggleMember = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {editGroup ? "Edit Task Group" : "Create Task Group"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Group Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Development Team"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Members
            </label>
            <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <label
                    key={employee.id}
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.members.includes(employee.id)}
                      onChange={() => toggleMember(employee.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">
                      {employee.username ||
                        employee.email ||
                        `User ${employee.id}`}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No employees available
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.members.length} member(s) selected
            </p>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editGroup ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Group Card Component
const TaskGroupCard = ({ group, onEdit, onDelete, employees }) => {
  const getMemberNames = (memberIds) => {
    if (!memberIds || memberIds.length === 0) return [];

    return memberIds.map((memberId) => {
      const employee = employees.find((e) => e.id === memberId);
      return {
        id: memberId,
        name: employee
          ? employee.username || employee.email || `User ${memberId}`
          : `User ${memberId}`,
      };
    });
  };

  const members = getMemberNames(group.members);
  const createdBy =
    group.created_by?.username || group.created_by?.email || "Unknown";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">{group.name}</h3>
          <p className="text-sm text-gray-500">
            Created by: <span className="font-medium">{createdBy}</span>
          </p>
          <p className="text-xs text-gray-400">
            {new Date(group.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(group)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(group.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">
          Members ({members.length})
        </p>
        {members.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {members.map((member) => (
              <span
                key={member.id}
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
              >
                {member.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No members assigned</p>
        )}
      </div>
    </div>
  );
};

// Main Task Groups Component
const ManagerTaskGroups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [taskGroups, setTaskGroups] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch employees (role='employee')
  const fetchEmployees = async () => {
    try {
      const response = await fetchWithAuth(
        "http://127.0.0.1:8000/api/users/employees/"
      );

      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      } else {
        console.error("Failed to fetch employees");
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setEmployees([]);
    }
  };

  // Fetch task groups
  const fetchTaskGroups = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchWithAuth(`${API_BASE_URL}/groups/`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setTaskGroups(data);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to fetch task groups");
      }
    } catch (error) {
      console.error("Error fetching task groups:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Create new task group
  const handleCreateGroup = async (formData) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/groups/`, {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          members: formData.members,
        }),
      });

      if (response.ok) {
        const newGroup = await response.json();
        console.log("Group created successfully:", newGroup);
        await fetchTaskGroups(); // Refresh the list
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    }
  };

  // Update existing task group
  const handleEditGroup = async (formData) => {
    try {
      const response = await fetchWithAuth(
        `${API_BASE_URL}/groups/${editingGroup.id}/`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: formData.name,
            members: formData.members,
          }),
        }
      );

      if (response.ok) {
        const updatedGroup = await response.json();
        console.log("Group updated successfully:", updatedGroup);
        await fetchTaskGroups(); // Refresh the list
        setEditingGroup(null);
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Error updating group:", error);
      alert("Failed to update group. Please try again.");
    }
  };

  // Delete task group
  const handleDeleteGroup = async (groupId) => {
    if (window.confirm("Are you sure you want to delete this task group?")) {
      try {
        const response = await fetchWithAuth(
          `${API_BASE_URL}/groups/${groupId}/`,
          {
            method: "DELETE",
          }
        );

        if (response.ok || response.status === 204) {
          console.log("Group deleted successfully");
          await fetchTaskGroups(); // Refresh the list
        } else {
          const errorData = await response.json();
          alert(`Error: ${JSON.stringify(errorData)}`);
        }
      } catch (error) {
        console.error("Error deleting group:", error);
        alert("Failed to delete group. Please try again.");
      }
    }
  };

  const openEditModal = (group) => {
    setEditingGroup(group);
    setIsModalOpen(true);
  };

  const onClose = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
  };

  // Load data on component mount
  useEffect(() => {
    fetchEmployees();
    fetchTaskGroups();
  }, []);

  const filteredGroups = taskGroups.filter((group) => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = group.name.toLowerCase().includes(searchLower);

    // Search in member IDs or names if you have them
    const memberMatch = group.members?.some((memberId) => {
      const employee = employees.find((e) => e.id === memberId);
      const employeeName = employee
        ? employee.username || employee.email || ""
        : "";
      return employeeName.toLowerCase().includes(searchLower);
    });

    return nameMatch || memberMatch;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <TaskGroupModal
        isOpen={isModalOpen}
        onClose={onClose}
        onSubmit={editingGroup ? handleEditGroup : handleCreateGroup}
        editGroup={editingGroup}
        employees={employees}
      />

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Task Groups</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Task Group
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search task groups or members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading task groups...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <TaskGroupCard
                key={group.id}
                group={group}
                onEdit={openEditModal}
                onDelete={handleDeleteGroup}
                employees={employees}
              />
            ))}
          </div>

          {filteredGroups.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No task groups found</p>
              <p className="text-gray-400 text-sm mt-2">
                Create your first task group to get started
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManagerTaskGroups;
