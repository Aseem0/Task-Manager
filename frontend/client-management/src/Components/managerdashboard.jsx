import React from "react";

const DashboardContent = () => {
  const stats = [
    { title: "Total Client", value: "60%", bgColor: "bg-blue-100" },
    { title: "Total Project", value: "20%", bgColor: "bg-blue-100" },
    { title: "Total Task", value: "40%", bgColor: "bg-blue-100" },
  ];

  const tasks = [
    { name: "Testing", assignedTo: "Nira Rajendranye", progress: 75 },
    { name: "Backend", assignedTo: "Pritam Shrestha", progress: 60 },
    { name: "Front end", assignedTo: "Aasish Rai", progress: 85 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} p-6 rounded-lg`}>
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Task Table */}
      <div className="bg-blue-100 p-6 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-4 text-gray-600 font-medium">Task name</th>
              <th className="pb-4 text-gray-600 font-medium">Assigned to</th>
              <th className="pb-4 text-gray-600 font-medium">Progress</th>
            </tr>
          </thead>
          <tbody className="space-y-3">
            {tasks.map((task, index) => (
              <tr
                key={index}
                className="border-b border-blue-200 last:border-b-0"
              >
                <td className="py-3 text-gray-800">{task.name}</td>
                <td className="py-3 text-gray-800">{task.assignedTo}</td>
                <td className="py-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex-1 bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 min-w-[3rem]">
                      {task.progress}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Overdue Tasks */}
      <div className="bg-blue-100 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Overdue Tasks</h3>
          <button className="text-blue-600 hover:text-blue-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-blue-200">
                <th className="pb-2 text-gray-600">Task</th>
                <th className="pb-2 text-gray-600">Project</th>
                <th className="pb-2 text-gray-600">Assigned To</th>
                <th className="pb-2 text-gray-600">Due Date</th>
                <th className="pb-2 text-gray-600">Days</th>
                <th className="pb-2 text-gray-600">Priority</th>
                <th className="pb-2 text-gray-600">Status</th>
                <th className="pb-2 text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-blue-200">
                <td className="py-2 text-gray-800">Sample Task</td>
                <td className="py-2 text-gray-800">Project A</td>
                <td className="py-2 text-gray-800">John Doe</td>
                <td className="py-2 text-gray-800">2025-01-15</td>
                <td className="py-2 text-red-600">-2</td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                    High
                  </span>
                </td>
                <td className="py-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Pending
                  </span>
                </td>
                <td className="py-2">
                  <button className="text-blue-600 hover:text-blue-800 text-xs">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;
