import React, { useState, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";

const API_BASE_URL = "http://127.0.0.1:8000/api";

const getAuthToken = () => localStorage.getItem("accessToken");

const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    window.location.href = "/";
    return null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/users/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("accessToken", data.access);
      return data.access;
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
      return null;
    }
  } catch (error) {
    window.location.href = "/";
    return null;
  }
};

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
  if (response.status === 401) {
    const newToken = await refreshAuthToken();
    if (newToken) {
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

// Stats Card Component
const StatsCard = ({ number, label, color }) => (
  <div className={`${color} rounded-lg p-6 text-center`}>
    <div className="text-4xl font-bold text-gray-800 mb-2">{number}</div>
    <div className="text-sm text-gray-600 font-medium">{label}</div>
  </div>
);

// Employee Tasks Modal Component
const EmployeeTasksModal = ({ isOpen, onClose, employee, tasks }) => {
  if (!isOpen || !employee) return null;

  // Filter tasks for this employee
  const employeeTasks = tasks.filter(
    (task) => task.assigned_to && task.assigned_to.includes(employee.id)
  );

  const todoTasks = employeeTasks.filter((t) => t.status === "todo");
  const inProgressTasks = employeeTasks.filter((t) => t.status === "in_progress");
  const completedTasks = employeeTasks.filter((t) => t.status === "completed");

  const TaskCard = ({ task, statusColor }) => (
    <div className={`p-3 rounded-lg border-l-4 ${statusColor} bg-white shadow-sm mb-2`}>
      <h4 className="font-medium text-gray-800">{task.title}</h4>
      {task.description && (
        <p className="text-sm text-gray-500 mt-1">{task.description}</p>
      )}
      {task.due_date && (
        <p className="text-xs text-gray-400 mt-1">Due: {task.due_date}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {employee.username}'s Tasks
            </h2>
            <p className="text-sm text-gray-500">{employee.email}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {employeeTasks.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No tasks assigned to this employee.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* To Do Column */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-700">
                    To Do ({todoTasks.length})
                  </h3>
                </div>
                {todoTasks.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No tasks</p>
                ) : (
                  todoTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      statusColor="border-yellow-500"
                    />
                  ))
                )}
              </div>

              {/* In Progress Column */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-700">
                    In Progress ({inProgressTasks.length})
                  </h3>
                </div>
                {inProgressTasks.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No tasks</p>
                ) : (
                  inProgressTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      statusColor="border-blue-500"
                    />
                  ))
                )}
              </div>

              {/* Completed Column */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <h3 className="font-semibold text-gray-700">
                    Completed ({completedTasks.length})
                  </h3>
                </div>
                {completedTasks.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No tasks</p>
                ) : (
                  completedTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      statusColor="border-green-500"
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Employee Table Row Component
const EmployeeRow = ({ employee, onViewTasks }) => {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-4 py-3 text-gray-700 font-medium">{employee.username}</td>
      <td className="px-4 py-3 text-gray-600">{employee.position || employee.role || "Employee"}</td>
      <td className="px-4 py-3 text-gray-600">{employee.email}</td>
      <td className="px-4 py-3">
        <button
          onClick={() => onViewTasks(employee)}
          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
        >
          View
        </button>
      </td>
    </tr>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users/employees/`);
      if (response.ok) {
        const data = await response.json();
        // Filter to only show employees
        const employeesOnly = Array.isArray(data)
          ? data.filter((emp) => emp.role === "employee")
          : [];
        setEmployees(employeesOnly);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/tasks/my-tasks/`);
      if (response.ok) {
        const data = await response.json();
        let taskList = [];
        if (Array.isArray(data)) {
          taskList = data;
        } else if (data.results && Array.isArray(data.results)) {
          taskList = data.results;
        } else if (data.tasks && Array.isArray(data.tasks)) {
          taskList = data.tasks;
        }
        setTasks(taskList);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchEmployees(), fetchTasks()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Calculate task statistics
  const assignedTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;

  // Handle view tasks
  const handleViewTasks = (employee) => {
    setSelectedEmployee(employee);
    setIsTaskModalOpen(true);
  };

  // Filter employees
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      roleFilter === "All" || employee.position === roleFilter || employee.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Employee Tasks Modal */}
      <EmployeeTasksModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedEmployee(null);
        }}
        employee={selectedEmployee}
        tasks={tasks}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard
          number={loading ? "..." : assignedTasks}
          label="Assigned Tasks"
          color="bg-blue-100"
        />
        <StatsCard
          number={loading ? "..." : inProgressTasks}
          label="In Progress Tasks"
          color="bg-yellow-100"
        />
        <StatsCard
          number={loading ? "..." : completedTasks}
          label="Completed Tasks"
          color="bg-green-100"
        />
      </div>

      {/* Employees Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Employee List</h2>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search employees"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative min-w-[150px]">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Position: All</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="QA Engineer">QA Engineer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Position</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">View</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Loading employees...
                  </td>
                </tr>
              ) : filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <EmployeeRow
                    key={employee.id}
                    employee={employee}
                    onViewTasks={handleViewTasks}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Statistics */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Task Statistics
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-center text-sm font-semibold mb-4 text-gray-700">
              Tasks by Status
            </h3>
            <div className="flex items-end justify-center gap-8 h-64">
              <div className="flex flex-col items-center">
                <div
                  className="w-20 bg-yellow-500 rounded-t"
                  style={{ height: `${Math.min((tasks.filter(t => t.status === 'todo').length / Math.max(tasks.length, 1)) * 200, 200)}px` }}
                ></div>
                <span className="text-xs mt-2 text-gray-600">
                  To Do ({tasks.filter(t => t.status === 'todo').length})
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-20 bg-blue-500 rounded-t"
                  style={{ height: `${Math.min((inProgressTasks / Math.max(tasks.length, 1)) * 200, 200)}px` }}
                ></div>
                <span className="text-xs mt-2 text-gray-600">
                  In Progress ({inProgressTasks})
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-20 bg-green-600 rounded-t"
                  style={{ height: `${Math.min((completedTasks / Math.max(tasks.length, 1)) * 200, 200)}px` }}
                ></div>
                <span className="text-xs mt-2 text-gray-600">
                  Completed ({completedTasks})
                </span>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col">
            <h3 className="text-center text-sm font-semibold mb-4 text-gray-700">
              Task Distribution
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-48 h-48">
                {tasks.length > 0 ? (
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="20"
                      strokeDasharray={`${(completedTasks / tasks.length) * 251} 251`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="20"
                      strokeDasharray={`${(inProgressTasks / tasks.length) * 251} 251`}
                      strokeDashoffset={`-${(completedTasks / tasks.length) * 251}`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#EAB308"
                      strokeWidth="20"
                      strokeDasharray={`${(tasks.filter(t => t.status === 'todo').length / tasks.length) * 251} 251`}
                      strokeDashoffset={`-${((completedTasks + inProgressTasks) / tasks.length) * 251}`}
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="20"
                    />
                  </svg>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-700">{tasks.length}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Completed ({completedTasks})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">In Progress ({inProgressTasks})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">To Do ({tasks.filter(t => t.status === 'todo').length})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
