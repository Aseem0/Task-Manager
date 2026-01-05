import React, { useState } from "react";
import { RefreshCw } from "lucide-react";

// Stats Card Component
const AnalyticsCard = ({ number, label }) => (
  <div className="bg-gray-200 rounded-lg p-6 text-center">
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
  const [timeFilter, setTimeFilter] = useState("This Month");

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Analytics Overview Header */}
      <div className="bg-gray-200 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Analytics Overview
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimeFilter("Today")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === "Today"
                  ? "bg-white text-gray-800 shadow"
                  : "text-gray-600 hover:bg-white hover:bg-opacity-50"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter("This Week")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === "This Week"
                  ? "bg-white text-gray-800 shadow"
                  : "text-gray-600 hover:bg-white hover:bg-opacity-50"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeFilter("This Month")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === "This Month"
                  ? "bg-white text-gray-800 shadow"
                  : "text-gray-600 hover:bg-white hover:bg-opacity-50"
              }`}
            >
              This Month
            </button>
            <button className="p-2 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors">
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <AnalyticsCard number="10" label="Total Projects" />
        <AnalyticsCard number="10" label="Active Tasks" />
        <AnalyticsCard number="10" label="Completed Tasks" />
        <AnalyticsCard number="100" label="Hours Spend" />
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
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {/* Blue - Completed Task (approx 62.5%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="20"
                    strokeDasharray="157 251"
                  />
                  {/* Orange - Active Task (approx 25%) */}
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
                  {/* Red - Overdue Task (approx 12.5%) */}
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
                  <div className="w-32 h-32 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Completed Task</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Active Task</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Overdue Task</span>
              </div>
            </div>
          </div>

          {/* Completion Rate & Alerts */}
          <div className="space-y-6">
            {/* Completion Percentage */}
            <div className="bg-white rounded-lg p-6">
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-4xl font-bold text-gray-800">10</span>
                  <span className="text-xl text-gray-600">% Completed</span>
                </div>
                <p className="text-xs text-gray-500">1/10 Task</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: "10%" }}
                ></div>
              </div>
            </div>

            {/* Insight Alerts */}
            <div className="space-y-4">
              <InsightAlert
                type="success"
                message="Most tasks are currently active."
              />
              <InsightAlert type="error" message="9 Tasks are overdue." />
              <InsightAlert
                type="warning"
                message="Tasks completion rate is low."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerAnalytics;
