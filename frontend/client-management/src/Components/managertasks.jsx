import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  SlidersHorizontal,
} from "lucide-react";

// API Configuration
const API_BASE_URL = "http://127.0.0.1:8000/api/tasks";

const getAuthToken = () => localStorage.getItem("accessToken");

const refreshAuthToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    window.location.href = "/";
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

// Edit Task Modal Component
const EditTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  employees,
  taskGroups,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: [],
    group: "",
    due_date: "",
    status: "todo",
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        assigned_to: task.assigned_to || [],
        group: task.group || "",
        due_date: task.due_date || "",
        status: task.status || "todo",
      });
    }
  }, [task]);

  const handleSubmit = () => {
    if (formData.title.trim()) {
      const submitData = {
        title: formData.title,
        description: formData.description,
        assigned_to: formData.assigned_to,
        group: formData.group ? parseInt(formData.group) : null,
        due_date: formData.due_date,
        status: formData.status,
      };
      onSubmit(submitData);
    }
  };

  const toggleEmployee = (employeeId) => {
    setFormData((prev) => ({
      ...prev,
      assigned_to: prev.assigned_to.includes(employeeId)
        ? prev.assigned_to.filter((id) => id !== employeeId)
        : [...prev.assigned_to, employeeId],
    }));
  };

  if (!isOpen) return null;

  const employeeList = Array.isArray(employees) ? employees : [];
  const groupList = Array.isArray(taskGroups) ? taskGroups : [];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Edit Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Group
              </label>
              <select
                value={formData.group}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, group: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a group</option>
                {groupList.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, due_date: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Employees
              </label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                {employeeList.length > 0 ? (
                  employeeList.map((employee) => (
                    <label
                      key={employee.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.assigned_to.includes(employee.id)}
                        onChange={() => toggleEmployee(employee.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-medium">
                          {employee.username ||
                            employee.email ||
                            `User ${employee.id}`}
                        </span>
                        {employee.email && (
                          <span className="text-xs text-gray-500">
                            {employee.email}
                          </span>
                        )}
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No employees available
                  </p>
                )}
              </div>
            </div>
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
              Update Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Task Modal Component
const AddTaskModal = ({ isOpen, onClose, onSubmit, employees, taskGroups }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assigned_to: [],
    group: "",
    due_date: "",
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        assigned_to: [],
        group: "",
        due_date: "",
      });
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (formData.title.trim()) {
      // Validate: must have either assigned_to or group
      if (formData.assigned_to.length === 0 && !formData.group) {
        alert(
          "Please assign the task to at least one employee or select a group"
        );
        return;
      }

      // Convert assigned_to to array of IDs and group to number
      const submitData = {
        title: formData.title,
        description: formData.description,
        assigned_to: formData.assigned_to,
        group: formData.group ? parseInt(formData.group) : null,
        due_date: formData.due_date,
      };

      console.log("📝 Submitting task data:", submitData);
      onSubmit(submitData);
    } else {
      alert("Please enter a task title");
    }
  };

  const toggleEmployee = (employeeId) => {
    setFormData((prev) => ({
      ...prev,
      assigned_to: prev.assigned_to.includes(employeeId)
        ? prev.assigned_to.filter((id) => id !== employeeId)
        : [...prev.assigned_to, employeeId],
    }));
  };

  if (!isOpen) return null;

  const employeeList = Array.isArray(employees) ? employees : [];
  const groupList = Array.isArray(taskGroups) ? taskGroups : [];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task description"
              />
            </div>

            {/* Task Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Group (Optional)
              </label>
              <select
                value={formData.group}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, group: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a group</option>
                {groupList.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, due_date: e.target.value }))
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Assign Employees */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Employees (Optional if Group is selected)
              </label>
              <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                {employeeList.length > 0 ? (
                  employeeList.map((employee) => (
                    <label
                      key={employee.id}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.assigned_to.includes(employee.id)}
                        onChange={() => toggleEmployee(employee.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                      <div className="flex flex-col">
                        <span className="text-gray-700 font-medium">
                          {employee.username ||
                            employee.email ||
                            `User ${employee.id}`}
                        </span>
                        {employee.email && (
                          <span className="text-xs text-gray-500">
                            {employee.email}
                          </span>
                        )}
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No employees available
                  </p>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {formData.assigned_to.length} employee(s) selected
              </p>
            </div>
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
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Task Row Component
const TaskRow = ({ task, onEdit, onDelete, employees, taskGroups }) => {
  // Get assigned employees names
  const getAssignedNames = () => {
    if (!task.assigned_to || task.assigned_to.length === 0)
      return "Not assigned";

    const employeeList = Array.isArray(employees) ? employees : [];
    const names = task.assigned_to.map((empId) => {
      const emp = employeeList.find((e) => e.id === empId);
      return emp
        ? emp.username || emp.first_name || emp.email || `Employee ${empId}`
        : `Employee ${empId}`;
    });

    return names.join(", ") || "Not assigned";
  };

  // Get group name and its members
  const getGroupInfo = () => {
    if (!task.group) return "No group";

    const groupList = Array.isArray(taskGroups) ? taskGroups : [];
    const group = groupList.find((g) => g.id === task.group);

    return group ? group.name : `Group ${task.group}`;
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="px-6 py-4 text-gray-800 font-medium">{task.title}</td>
      <td className="px-6 py-4 text-gray-600">
        {task.description || "No description"}
      </td>
      <td className="px-6 py-4 text-gray-700">{getAssignedNames()}</td>
      <td className="px-6 py-4 text-gray-700">{getGroupInfo()}</td>
      <td className="px-6 py-4 text-gray-700">
        {task.due_date || "No due date"}
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </tr>
  );
};

// Main Tasks Component
const ManagerTasks = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [taskGroups, setTaskGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  // Fetch employees
  // Fetch employees (FIXED – same as ManagerTaskGroups)
  const fetchEmployees = async () => {
    try {
      console.log("🔍 Fetching employees from API...");
      const response = await fetchWithAuth(
        "http://127.0.0.1:8000/api/clients/employees/"
      );

      if (!response.ok) {
        console.error("❌ Failed to fetch employees");
        setEmployees([]);
        return;
      }

      const data = await response.json();
      console.log("✅ Employee API response:", data);

      // ✅ SAME LOGIC AS ManagerTaskGroups
      if (Array.isArray(data.employees)) {
        setEmployees(data.employees);
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.error("💥 Error fetching employees:", error);
      setEmployees([]);
    }
  };

  // Fetch task groups
  const fetchTaskGroups = async () => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/groups/`);
      if (response.ok) {
        const data = await response.json();
        setTaskGroups(Array.isArray(data) ? data : data.results || []);
      }
    } catch (error) {
      console.error("Error fetching task groups:", error);
    }
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching tasks...");

      const response = await fetchWithAuth(`${API_BASE_URL}/my-tasks/`);

      console.log("📡 Tasks response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Tasks fetched:", data);

        // Handle different response formats
        let taskList = [];
        if (Array.isArray(data)) {
          taskList = data;
        } else if (data.results && Array.isArray(data.results)) {
          taskList = data.results;
        } else if (data.tasks && Array.isArray(data.tasks)) {
          taskList = data.tasks;
        }

        console.log("📊 Task count:", taskList.length);
        setTasks(taskList);
      } else {
        const errorText = await response.text();
        console.error("❌ Failed to fetch tasks:", errorText);
      }
    } catch (error) {
      console.error("💥 Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create task
  const handleCreateTask = async (formData) => {
    try {
      console.log("📤 Creating task with data:", formData);

      const response = await fetchWithAuth(`${API_BASE_URL}/create/`, {
        method: "POST",
        body: JSON.stringify(formData),
      });

      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Task created successfully:", result);
        setIsModalOpen(false);
        await fetchTasks(); // Refresh task list
        alert("Task created successfully!");
      } else {
        const errorData = await response.json();
        console.error("❌ Error response:", errorData);
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("💥 Error creating task:", error);
      alert("Failed to create task. Check console for details.");
    }
  };

  // Update task
  const handleEditTask = async (formData) => {
    try {
      console.log("📝 Updating task:", editingTask.id, "with data:", formData);

      const response = await fetchWithAuth(
        `${API_BASE_URL}/${editingTask.id}/`,
        {
          method: "PATCH",
          body: JSON.stringify(formData),
        }
      );

      console.log("📡 Response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Task updated successfully:", result);
        setIsEditModalOpen(false);
        setEditingTask(null);
        await fetchTasks();
        alert("Task updated successfully!");
      } else {
        const errorData = await response.json();
        console.error("❌ Error response:", errorData);
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("💥 Error updating task:", error);
      alert("Failed to update task. Check console for details.");
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/${taskId}/`, {
          method: "DELETE",
        });
        if (response.ok) {
          await fetchTasks();
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      // Fetch employees FIRST, then tasks
      await fetchEmployees();
      await fetchTaskGroups();
      await fetchTasks();
    };

    loadData();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesTab =
      activeTab === "All" ||
      (activeTab === "Active" && task.status === "in_progress") ||
      (activeTab === "Overdue" && task.status === "overdue");
    const matchesSearch = task.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        employees={employees}
        taskGroups={taskGroups}
      />

      <EditTaskModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleEditTask}
        task={editingTask}
        employees={employees} 
        taskGroups={taskGroups}
      />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex justify-end items-center px-6 pt-6 pb-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        <div className="flex justify-between items-center px-6 pb-4">
          <button className="flex items-center gap-2 text-gray-700">
            <SlidersHorizontal className="w-5 h-5" />
            <span className="font-medium">Filter: All</span>
          </button>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Group
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Loading tasks...
                  </td>
                </tr>
              ) : filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onEdit={openEditModal}
                    onDelete={handleDeleteTask}
                    employees={employees}
                    taskGroups={taskGroups}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No tasks found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerTasks;
