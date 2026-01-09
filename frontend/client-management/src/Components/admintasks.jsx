import React, { useState } from 'react'

const AdminTasksContent = () => {
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  
  const tasks = [
    {
      id: 1,
      task: 'UI design',
      project: 'Task Management system',
      status: 'Active',
      progress: 70,
      priority: 'Medium',
      dueDate: '2025/12/30'
    },
    {
      id: 2,
      task: 'API Integration',
      project: 'Task Management system',
      status: 'Overdue',
      progress: 80,
      priority: 'Low',
      dueDate: '2025/12/28'
    },
    {
      id: 3,
      task: 'Testing',
      project: 'Banking system',
      status: 'Active',
      progress: 50,
      priority: 'High',
      dueDate: '2026/01/04'
    },
    {
      id: 4,
      task: 'Frontend',
      project: 'E-Commerce system',
      status: 'Overdue',
      progress: 90,
      priority: 'Low',
      dueDate: '2025/12/31'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'text-green-600'
      case 'Overdue':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusDot = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500'
      case 'Overdue':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Active') return task.status === 'Active'
    if (activeFilter === 'Overdue') return task.status === 'Overdue'
    return true
  })

  return (
    <div className="p-6">
      <div className="bg-slate-100 rounded-2xl p-6">
        {/* Filter Tabs and Add Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveFilter('All')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeFilter === 'All'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('Active')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeFilter === 'Active'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveFilter('Overdue')}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeFilter === 'Overdue'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }`}
            >
              Overdue
            </button>
          </div>

          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-md">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Task</span>
          </button>
        </div>

        {/* Filter and Search */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
            <span className="text-slate-600 font-medium">Filter: All</span>
            <button className="text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2 shadow-sm">
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-slate-600 placeholder-slate-400 focus:outline-none w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Task</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Project</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Progress</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Priority</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Due date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-800 font-medium">{task.task}</td>
                    <td className="px-6 py-4 text-sm text-slate-800">{task.project}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusDot(task.status)}`}></div>
                        <span className={`text-sm font-medium ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-800">{task.progress}%</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-800">{task.dueDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col items-start space-y-1">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">View</button>
                        <button className="text-blue-600 hover:text-blue-800 font-medium">Update/Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-end mt-6">
          <button className="p-2 bg-white rounded-lg shadow-sm hover:bg-slate-50 transition-colors">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminTasksContent