import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";

// Stats Card Component
const StatsCard = ({ number, label }) => (
  <div className="bg-gray-200 rounded-lg p-6 text-center">
    <div className="text-4xl font-bold text-gray-800 mb-2">{number}</div>
    <div className="text-sm text-gray-600 font-medium">{label}</div>
  </div>
);

// Employee Table Row Component
const EmployeeRow = ({ name, role, email, status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "complete":
        return "text-green-600";
      case "active":
        return "text-blue-600";
      case "overdue":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <tr className="border-b border-gray-200">
      <td className="px-4 py-3 text-gray-700">{name}</td>
      <td className="px-4 py-3 text-gray-700">{role}</td>
      <td className="px-4 py-3 text-gray-700">{email}</td>
      <td className={`px-4 py-3 font-medium ${getStatusColor(status)}`}>
        {status}
      </td>
      <td className="px-4 py-3">
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          View
        </button>
      </td>
    </tr>
  );
};

// Employee History Card Component
const EmployeeCard = ({ name }) => (
  <div className="bg-white rounded-lg p-6 text-center shadow-sm">
    <div className="w-24 h-24 bg-blue-200 rounded-full mx-auto mb-4 flex items-center justify-center">
      <svg
        className="w-12 h-12 text-blue-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
    </div>
    <h3 className="text-gray-800 font-semibold mb-3">{name}</h3>
    <button className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition-colors">
      Details
    </button>
  </div>
);

// Main Dashboard Component
const ManagerDashboard = () => {
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const allEmployees = [
    {
      name: "Aastha Shrestha",
      role: "UI/UX Designer",
      email: "abc@gmail.com",
      status: "Complete",
    },
    {
      name: "Pritam Shrestha",
      role: "Backend Developer",
      email: "hello@gmail.com",
      status: "Active",
    },
    {
      name: "Aseem Rai",
      role: "Frontend Developer",
      email: "hehe@gmail.com",
      status: "Overdue",
    },
  ];

  const filteredEmployees = allEmployees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || employee.role === roleFilter;
    const matchesStatus =
      statusFilter === "All" || employee.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header with Create Task Button */}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatsCard number="10" label="Assigned Task" />
        <StatsCard number="10" label="Overdue Task" />
        <StatsCard number="10" label="Completed Tasks" />
      </div>

      {/* Employees Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Employees Filter</h2>
          <button className="text-blue-600 flex items-center gap-2 hover:text-blue-800">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter
          </button>
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
              <option value="All">Role: All</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <div className="relative min-w-[150px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">Status: All</option>
              <option value="Complete">Complete</option>
              <option value="Active">Active</option>
              <option value="Overdue">Overdue</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          <button className="px-8 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors">
            Filter
          </button>
        </div>

        {/* Employee Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Name</th>
                <th className="px-4 py-3 text-left font-semibold">Role</th>
                <th className="px-4 py-3 text-left font-semibold">Email</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">View</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {filteredEmployees.map((employee, index) => (
                <EmployeeRow key={index} {...employee} />
              ))}
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
              Tasks by Priority
            </h3>
            <div className="flex items-end justify-center gap-8 h-64">
              <div className="flex flex-col items-center">
                <div
                  className="w-20 bg-red-500"
                  style={{ height: "80%" }}
                ></div>
                <span className="text-xs mt-2 text-gray-600">
                  High Priority Level
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-20 bg-orange-500"
                  style={{ height: "60%" }}
                ></div>
                <span className="text-xs mt-2 text-gray-600">
                  Medium Priority Level
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className="w-20 bg-green-600"
                  style={{ height: "40%" }}
                ></div>
                <span className="text-xs mt-2 text-gray-600">Low</span>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="bg-gray-50 p-4 rounded-lg flex flex-col">
            <h3 className="text-center text-sm font-semibold mb-4 text-gray-700">
              Task by Status
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-48 h-48">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="20"
                    strokeDasharray="157 251"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="20"
                    strokeDasharray="63 251"
                    strokeDashoffset="-157"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="20"
                    strokeDasharray="31 251"
                    strokeDashoffset="-220"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Completed Task</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Active Task</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Overdue Task</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Employees History */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Employees History</h2>
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <EmployeeCard name="Aastha Shrestha" />
          <EmployeeCard name="Pritam Shrestha" />
          <EmployeeCard name="Aseem Rai" />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
