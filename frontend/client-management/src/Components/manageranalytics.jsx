import React, { useState, useEffect } from "react";

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
const AnalyticsCard = ({ number, label, color }) => (
  <div className={`${color} rounded-lg p-6 text-center`}>
    <div className="text-4xl font-bold text-gray-800 mb-2">{number}</div>
    <div className="text-sm text-gray-600 font-medium">{label}</div>
  </div>
);

// Insight Alert Component
const InsightAlert = ({ type, message }) => {
  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return { bg: "bg-green-50", icon: "✓", iconBg: "bg-green-500" };
      case "error":
        return { bg: "bg-red-50", icon: "!", iconBg: "bg-red-500" };
      case "warning":
        return { bg: "bg-yellow-50", icon: "⚠", iconBg: "bg-yellow-500" };
      default:
        return { bg: "bg-gray-50", icon: "i", iconBg: "bg-gray-500" };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className={`${styles.bg} rounded-lg p-4 flex items-center gap-3`}>
      <div
        className={`${styles.iconBg} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
      >
        {styles.icon}
      </div>
      <p className="text-gray-700 text-sm">{message}</p>
    </div>
  );
};

// Main Analytics Component
const ManagerAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Fetch tasks
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

  // Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/tasks/groups/`);
      if (response.ok) {
        const data = await response.json();
        const projectList = Array.isArray(data) ? data : data.results || [];
        setProjects(projectList);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/users/employees/`);
      if (response.ok) {
        const data = await response.json();
        const employeeList = Array.isArray(data)
          ? data.filter((emp) => emp.role === "employee")
          : [];
        setEmployees(employeeList);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchTasks(), fetchProjects(), fetchEmployees()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Calculate statistics
  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((t) => t.status === "todo").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const assignedTasks = totalTasks; // All tasks are assigned

  // Calculate completion percentage
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  // Calculate chart values (percentages of circumference, circumference = 2 * π * r ≈ 251 for r=40)
  const circumference = 251;
  const completedDash = totalTasks > 0 ? (completedTasks / totalTasks) * circumference : 0;
  const assignedDash = totalTasks > 0 ? (todoTasks / totalTasks) * circumference : 0;
  const inProgressDash = totalTasks > 0 ? (inProgressTasks / totalTasks) * circumference : 0;

  // Generate dynamic insights
  const generateInsights = () => {
    const insights = [];
    
    if (completedTasks > 0 && completedTasks >= totalTasks / 2) {
      insights.push({
        type: "success",
        message: `Great progress! ${completedTasks} out of ${totalTasks} tasks are completed.`
      });
    }
    
    if (inProgressTasks > 0) {
      insights.push({
        type: "warning",
        message: `${inProgressTasks} tasks are currently in progress.`
      });
    }
    
    if (todoTasks > 0) {
      insights.push({
        type: "error",
        message: `${todoTasks} tasks are still pending (To Do).`
      });
    }
    
    if (completionPercentage < 50 && totalTasks > 0) {
      insights.push({
        type: "warning",
        message: "Task completion rate is below 50%. Consider prioritizing pending tasks."
      });
    }
    
    if (completionPercentage >= 80) {
      insights.push({
        type: "success",
        message: "Excellent! Task completion rate is above 80%!"
      });
    }

    if (totalTasks === 0) {
      insights.push({
        type: "warning",
        message: "No tasks found. Start by creating some tasks for your team."
      });
    }

    return insights.slice(0, 3); // Limit to 3 insights
  };

  const insights = generateInsights();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Analytics Overview Header */}
      <div className="bg-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Analytics Overview
          </h1>
          {loading && (
            <span className="text-sm text-gray-500">Loading...</span>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AnalyticsCard 
          number={loading ? "..." : totalProjects} 
          label="Total Projects" 
          color="bg-purple-100"
        />
        <AnalyticsCard 
          number={loading ? "..." : assignedTasks} 
          label="Assigned Tasks" 
          color="bg-blue-100"
        />
        <AnalyticsCard 
          number={loading ? "..." : completedTasks} 
          label="Completed Tasks" 
          color="bg-green-100"
        />
      </div>

      {/* Insights Section */}
      <div className="bg-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Insights</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Status Chart */}
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
              Task Status
            </h3>

            <div className="flex items-center justify-center mb-6">
              <div className="relative w-64 h-64">
                {/* Donut Chart */}
                {totalTasks > 0 ? (
                  <svg viewBox="0 0 100 100" className="transform -rotate-90">
                    {/* Blue - Completed Task */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="20"
                      strokeDasharray={`${completedDash} ${circumference}`}
                    />
                    {/* Orange - Assigned/Todo Task */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="20"
                      strokeDasharray={`${assignedDash} ${circumference}`}
                      strokeDashoffset={`-${completedDash}`}
                    />
                    {/* Red - In Progress Task */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="20"
                      strokeDasharray={`${inProgressDash} ${circumference}`}
                      strokeDashoffset={`-${completedDash + assignedDash}`}
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
                  <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-700">{totalTasks}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">Completed Task</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">{completedTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">To Do Task</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">{todoTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">In Progress Task</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">{inProgressTasks}</span>
              </div>
            </div>
          </div>

          {/* Completion Rate & Alerts */}
          <div className="space-y-6">
            {/* Completion Percentage */}
            <div className="bg-white rounded-lg p-6">
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-gray-800">
                    {loading ? "..." : completionPercentage}
                  </span>
                  <span className="text-xl text-gray-600">% Completed</span>
                </div>
                <p className="text-xs text-gray-500">
                  {completedTasks}/{totalTasks} Tasks
                </p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Insight Alerts */}
            <div className="space-y-4">
              {insights.length > 0 ? (
                insights.map((insight, index) => (
                  <InsightAlert
                    key={index}
                    type={insight.type}
                    message={insight.message}
                  />
                ))
              ) : (
                <InsightAlert
                  type="success"
                  message="All systems running smoothly!"
                />
              )}
            </div>

            {/* Team Overview */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Team Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {loading ? "..." : employees.length}
                  </div>
                  <div className="text-xs text-gray-500">Total Employees</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {loading ? "..." : totalProjects}
                  </div>
                  <div className="text-xs text-gray-500">Active Projects</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerAnalytics;
