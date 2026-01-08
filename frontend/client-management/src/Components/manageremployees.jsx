import React, { useState, useEffect } from "react";
import { X, Plus, Edit2, Trash2 } from "lucide-react";
import { signup } from "../Services/auth";

const API_URL = "http://127.0.0.1:8000/api/users/";

// Helper function to refresh access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
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
  throw new Error("Failed to refresh token");
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
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  }
  return response;
};

export default function ManagerEmployees() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "employee",
  });

  // Function to open modal with fresh/empty form
  const openAddModal = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "employee",
    });
    setEditingEmployee(null);
    setError("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  // Function to open modal for editing
  const openEditModal = (employee) => {
    setFormData({
      username: employee.username,
      email: employee.email,
      password: "",
      role: employee.role,
    });
    setEditingEmployee(employee);
    setError("");
    setSuccessMessage("");
    setIsModalOpen(true);
  };

  // Function to delete an employee
  const handleDeleteEmployee = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(`${API_URL}employees/${employeeId}/`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        // Remove from local state
        setEmployees(employees.filter((e) => e.id !== employeeId));
        setSuccessMessage("Employee deleted successfully!");
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to delete employee");
      }
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError("Failed to delete employee");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch employees from backend on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await fetchWithAuth(`${API_URL}employees/`);
      if (response.ok) {
        const data = await response.json();
        // Filter to only show employees (not managers or admins)
        const employeesOnly = data.filter((emp) => emp.role === 'employee');
        setEmployees(employeesOnly);
      } else {
        // If endpoint doesn't exist yet, fallback to empty array
        console.log("Employees endpoint not available yet");
        setEmployees([]);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to fetch employees");
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
    // For editing, password is optional; for adding, all fields required
    const isEditing = editingEmployee !== null;
    
    if (!formData.username || !formData.email || !formData.role) {
      setError("Please fill in all required fields");
      return;
    }
    
    if (!isEditing && !formData.password) {
      setError("Password is required for new employees");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      if (isEditing) {
        // UPDATE existing employee
        const updateData = {
          username: formData.username,
          email: formData.email,
          role: formData.role,
        };
        
        // Only include password if it was provided
        if (formData.password && formData.password.trim() !== "") {
          updateData.password = formData.password;
        }

        const response = await fetchWithAuth(`${API_URL}employees/${editingEmployee.id}/`, {
          method: "PUT",
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          const data = await response.json();
          setSuccessMessage("Employee updated successfully!");
          setFormData({
            username: "",
            email: "",
            password: "",
            role: "employee",
          });
          setEditingEmployee(null);
          setIsModalOpen(false);
          // Refresh the employee list
          await fetchEmployees();
        } else {
          const errorData = await response.json();
          if (errorData.detail) {
            setError(errorData.detail);
          } else if (errorData.username || errorData.email || errorData.password) {
            const errors = [];
            if (errorData.username) errors.push(`Username: ${errorData.username}`);
            if (errorData.email) errors.push(`Email: ${errorData.email}`);
            if (errorData.password) errors.push(`Password: ${errorData.password}`);
            setError(errors.join(", "));
          } else {
            setError("Failed to update employee. Please try again.");
          }
        }
      } else {
        // ADD new employee
        const response = await signup({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });

        if (response.message && response.message.includes("successfully")) {
          // Success - add to local state and close modal
          setSuccessMessage("Employee added successfully!");
          setEmployees([...employees, response.user]);
          setFormData({
            username: "",
            email: "",
            password: "",
            role: "employee",
          });
          setIsModalOpen(false);
          // Refresh the employee list
          await fetchEmployees();
        } else if (response.error || response.detail) {
          // Handle API error
          setError(response.error || response.detail || "Failed to add employee");
        } else if (response.username || response.email || response.password) {
          // Handle validation errors
          const errors = [];
          if (response.username) errors.push(`Username: ${response.username}`);
          if (response.email) errors.push(`Email: ${response.email}`);
          if (response.password) errors.push(`Password: ${response.password}`);
          setError(errors.join(", "));
        } else {
          setError("Failed to add employee. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Employees</h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            Add Employee
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex items-center gap-4 p-4 border-b">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-md">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-gray-600"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      {isLoading ? "Loading employees..." : "No employees found"}
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {employee.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          employee.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : employee.role === 'manager' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {employee.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => openEditModal(employee)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit employee"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete employee"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end p-4 border-t">
            <button className="p-2 hover:bg-gray-100 rounded">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {successMessage && (
                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
                  {successMessage}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="emp_username"
                  autoComplete="off"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter username"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="emp_email"
                  autoComplete="off"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter email"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="emp_password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter password"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <select
                  name="emp_role"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  disabled={isLoading}
                >
                  <option value="employee">Employee</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setError("");
                    setSuccessMessage("");
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (editingEmployee ? 'Updating...' : 'Adding...') : (editingEmployee ? 'Update Employee' : 'Add Employee')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
