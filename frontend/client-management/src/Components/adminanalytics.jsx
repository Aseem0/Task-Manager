import React from 'react'

const AnalyticsContent = () => {
  const overviewStats = [
    { value: '10', label: 'Total Projects', bgColor: 'bg-slate-300' },
    { value: '10', label: 'Active Tasks', bgColor: 'bg-slate-300' },
    { value: '10', label: 'Completed Tasks', bgColor: 'bg-slate-300' },
    { value: '100', label: 'Hours Spend', bgColor: 'bg-slate-300' }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Analytics Overview Section */}
      <div className="bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Analytics Overview</h2>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-white rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              Today
            </button>
            <button className="px-4 py-2 bg-white rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              This Week
            </button>
            <button className="px-4 py-2 bg-white rounded-md text-sm text-slate-700 hover:bg-slate-50 transition-colors">
              This Month
            </button>
            <button className="p-2 bg-white rounded-md hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {overviewStats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} p-6 rounded-lg text-center`}>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">{stat.value}</h3>
              <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Section */}
      <div className="bg-slate-200 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Insights</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Task Status Chart */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">Task Status</h3>
            
            <div className="flex justify-center items-center mb-6">
              <div className="relative w-64 h-64">
                <svg viewBox="0 0 200 200" className="transform -rotate-90">
                  {/* Completed Task - Blue (70%) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="60"
                    strokeDasharray="308 439.6"
                  />
                  {/* Active Task - Orange (20%) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="60"
                    strokeDasharray="88 439.6"
                    strokeDashoffset="-308"
                  />
                  {/* Overdue Task - Red (10%) */}
                  <circle
                    cx="100"
                    cy="100"
                    r="70"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="60"
                    strokeDasharray="44 439.6"
                    strokeDashoffset="-396"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">Completed Task</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">Active Task</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">Overdue Task</span>
                </div>
              </div>
            </div>
          </div>

          {/* Completion Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
            <div>
              <div className="flex items-baseline space-x-2 mb-3">
                <span className="text-4xl font-bold text-slate-800">10</span>
                <span className="text-lg text-slate-600">% Completed</span>
              </div>
              <p className="text-sm text-slate-500 mb-3">1/10 Task</p>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div className="bg-blue-600 h-3 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-slate-700">Most tasks are currently active.</span>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <span className="text-sm text-slate-700">9 Tasks are overdue.</span>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-lg font-bold">⚠</span>
                </div>
                <span className="text-sm text-slate-700">Tasks completion rate is low.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsContent