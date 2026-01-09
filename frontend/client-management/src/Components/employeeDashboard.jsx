import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://localhost:8000/api/tasks/my-tasks/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from tasks
  const getStats = () => {
    return {
      assignedTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      inProgressTasks: tasks.filter(t => t.status === 'in_progress').length,
    };
  };

  const stats = getStats();

  // Get recent tasks (limit to 3 for dashboard)
  const myTasks = tasks.slice(0, 3);

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const getStatusColor = (status) => {
    const colors = {
      'todo': 'bg-gray-500',
      'in_progress': 'bg-blue-600',
      'review': 'bg-yellow-500',
      'completed': 'bg-green-600',
    };
    return colors[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status) => {
    const labels = {
      'todo': 'To Do',
      'in_progress': 'In Progress',
      'review': 'Review',
      'completed': 'Completed',
    };
    return labels[status] || status;
  };

  const handleViewAll = () => {
    navigate('/employee/tasks');
  };

  const handleTaskClick = (taskId) => {
    navigate('/employee/tasks');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Assigned Tasks */}
          <div className="bg-gray-200 rounded-2xl p-6 text-center">
            <h3 className="text-blue-900 font-semibold text-sm mb-2">
              Assigned Tasks
            </h3>
            <p className="text-4xl font-bold text-blue-900">{stats.assignedTasks}</p>
          </div>

          {/* Completed Tasks */}
          <div className="bg-gray-200 rounded-2xl p-6 text-center">
            <h3 className="text-blue-900 font-semibold text-sm mb-2">
              Completed Tasks
            </h3>
            <p className="text-4xl font-bold text-blue-900">{stats.completedTasks}</p>
          </div>

          {/* In Progress Tasks */}
          <div className="bg-gray-200 rounded-2xl p-6 text-center">
            <h3 className="text-blue-900 font-semibold text-sm mb-2">
              In Progress Tasks
            </h3>
            <p className="text-4xl font-bold text-blue-900">{stats.inProgressTasks}</p>
          </div>
        </div>

        {/* My Tasks Section */}
        <div className="bg-gray-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-blue-900 font-bold text-xl">My Tasks</h2>
            <button 
              onClick={handleViewAll}
              className="text-blue-600 text-sm hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {myTasks.length > 0 ? (
              myTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="bg-white rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleTaskClick(task.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-blue-900 font-semibold text-lg mb-2">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <span className={`inline-block ${getStatusColor(task.status)} text-white px-4 py-1 rounded-full text-xs font-medium`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-gray-600 text-xs mb-3">
                        Due: {formatDate(task.due_date)}
                      </p>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-600">No tasks assigned yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Tasks Section */}
        <div className="bg-gray-200 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-blue-900 font-bold text-xl">Upcoming Tasks</h2>
            <button 
              onClick={handleViewAll}
              className="text-blue-600 text-sm hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="bg-white rounded-xl p-5">
            {tasks.filter(t => t.status === 'todo' || t.status === 'in_progress').length > 0 ? (
              <div className="space-y-2">
                {tasks
                  .filter(t => t.status === 'todo' || t.status === 'in_progress')
                  .slice(0, 3)
                  .map((task) => (
                    <div 
                      key={task.id}
                      className="py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 px-2 rounded"
                      onClick={() => handleTaskClick(task.id)}
                    >
                      <p className="text-gray-800 font-medium text-sm">{task.title}</p>
                      <p className="text-gray-500 text-xs">Due: {formatDate(task.due_date)}</p>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-gray-800 font-medium">No upcoming tasks</p>
            )}
          </div>
        </div>

        {/* Announcement Section */}
        <div className="bg-gray-200 rounded-2xl p-6">
          <h2 className="text-blue-900 font-bold text-xl mb-4">Announcement</h2>

          <div className="bg-white rounded-xl p-5">
            <p className="text-gray-800 font-medium">No announcements</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
