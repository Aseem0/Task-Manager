import React, { useState } from 'react'

const CreateTask = ({ isOpen, onClose }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    assignedIndividual: '',
    assignedGroup: '',
    status: '',
    dueDate: '',
    description: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Task Created:', taskData)
    // Add your task creation logic here
    onClose()
  }

  const handleCancel = () => {
    setTaskData({
      title: '',
      assignedIndividual: '',
      assignedGroup: '',
      status: '',
      dueDate: '',
      description: ''
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-blue-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4">
          <h2 className="text-3xl font-bold text-white">Create Task</h2>
          <button
            onClick={handleCancel}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          <div className="bg-slate-100 rounded-xl p-6 space-y-5">
            {/* Task Title */}
            <div>
              <label className="block text-slate-800 font-semibold mb-2">Task Title</label>
              <input
                type="text"
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter task title"
              />
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-slate-800 font-semibold mb-2">Assigned To:</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <select
                    value={taskData.assignedIndividual}
                    onChange={(e) => setTaskData({ ...taskData, assignedIndividual: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="">Individuals</option>
                    <option value="john">John Doe</option>
                    <option value="jane">Jane Smith</option>
                    <option value="mike">Mike Johnson</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <select
                    value={taskData.assignedGroup}
                    onChange={(e) => setTaskData({ ...taskData, assignedGroup: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="">Group</option>
                    <option value="development">Development Team</option>
                    <option value="design">Design Team</option>
                    <option value="marketing">Marketing Team</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Status */}
            <div>
              <label className="block text-slate-800 font-semibold mb-2">Task Status</label>
              <div className="relative">
                <select
                  value={taskData.status}
                  onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer text-blue-600"
                >
                  <option value="">Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-slate-800 font-semibold mb-2">Due Date</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-slate-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="DD/MM/YYYY"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-800 font-semibold mb-2">Description</label>
              <textarea
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 rounded-lg bg-white border-none focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter task description"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-center space-x-4 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-slate-800 text-white rounded-full font-semibold hover:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-8 py-3 bg-slate-800 text-white rounded-full font-semibold hover:bg-slate-900 transition-colors"
              >
                Assign Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTask