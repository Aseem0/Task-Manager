import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users, CheckCircle, Clock, AlertCircle, Filter } from 'lucide-react';


const EmployeeProject = () => {
  const [groupTasks, setGroupTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  // Fetch group tasks on component mount
  useEffect(() => {
    fetchGroupTasks();
  }, []);

  // Apply filters whenever search or status filter changes
  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, groupTasks]);

  const fetchGroupTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://localhost:8000/api/tasks/my-tasks/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Filter only tasks that have a group assigned
      const tasksWithGroups = response.data.filter(task => task.group !== null);
      setGroupTasks(tasksWithGroups);
      setFilteredTasks(tasksWithGroups);
    } catch (err) {
      console.error('Error fetching group tasks:', err);
      setError('Failed to load group tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...groupTasks];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch(
        `http://localhost:8000/api/tasks/${taskId}/`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Update local state
      setGroupTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      // Update selected task if it's the one being updated
      if (selectedTask && selectedTask.id === taskId) {
        setSelectedTask({ ...selectedTask, status: newStatus });
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      alert('Failed to update task status. Please try again.');
    }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'review':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Filter className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getTaskStats = () => {
    return {
      total: groupTasks.length,
      todo: groupTasks.filter(t => t.status === 'todo').length,
      inProgress: groupTasks.filter(t => t.status === 'in_progress').length,
      completed: groupTasks.filter(t => t.status === 'completed').length,
    };
  };

  const stats = getTaskStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading group tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gray-200 rounded-2xl p-6">
          <h1 className="text-blue-900 font-bold text-2xl mb-2">Group Projects</h1>
          <p className="text-gray-600 text-sm">View and manage all your group tasks assigned by the manager</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-200 rounded-2xl p-6 text-center">
            <h3 className="text-blue-900 font-semibold text-sm mb-2">Total Tasks</h3>
            <p className="text-4xl font-bold text-blue-900">{stats.total}</p>
          </div>
          <div className="bg-gray-200 rounded-2xl p-6 text-center">
            <h3 className="text-blue-900 font-semibold text-sm mb-2">To Do</h3>
            <p className="text-4xl font-bold text-blue-900">{stats.todo}</p>
          </div>
          <div className="bg-gray-200 rounded-2xl p-6 text-center">
            <h3 className="text-blue-900 font-semibold text-sm mb-2">In Progress</h3>
            <p className="text-4xl font-bold text-blue-900">{stats.inProgress}</p>
          </div>
          <div className="bg-gray-200 rounded-2xl p-6 text-center">
            <h3 className="text-blue-900 font-semibold text-sm mb-2">Completed</h3>
            <p className="text-4xl font-bold text-blue-900">{stats.completed}</p>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-gray-200 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-none focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-gray-200 rounded-2xl p-6">
          <h2 className="text-blue-900 font-bold text-xl mb-4">Group Tasks</h2>
          
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchQuery || statusFilter !== 'all'
                  ? 'No tasks match your filters'
                  : 'No group tasks assigned yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedTask(task);
                    setShowTaskDetail(true);
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-blue-900 font-semibold text-lg">
                          {task.title}
                        </h3>
                        <span className={`inline-flex items-center gap-1.5 ${getStatusColor(task.status)} text-white px-3 py-1 rounded-full text-xs font-medium`}>
                          {getStatusIcon(task.status)}
                          {getStatusLabel(task.status)}
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {formatDate(task.due_date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          <span>
                            {task.group_details 
                              ? `${task.group_details.name} (${task.group_details.member_count} members)` 
                              : 'Group Task'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Update Dropdown */}
                    <div className="ml-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                      >
                        <option value="todo">To Do</option>
                        <option value="in_progress">In Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowTaskDetail(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-blue-900 font-bold text-2xl">{selectedTask.title}</h2>
              <button
                onClick={() => setShowTaskDetail(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-blue-900 font-semibold text-sm block mb-2">Status</label>
                <span className={`inline-flex items-center gap-1.5 ${getStatusColor(selectedTask.status)} text-white px-4 py-2 rounded-full text-sm font-medium`}>
                  {getStatusIcon(selectedTask.status)}
                  {getStatusLabel(selectedTask.status)}
                </span>
              </div>

              <div>
                <label className="text-blue-900 font-semibold text-sm block mb-2">Description</label>
                <p className="text-gray-600 text-sm bg-gray-50 p-4 rounded-xl">
                  {selectedTask.description || 'No description provided'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-blue-900 font-semibold text-sm block mb-2">Due Date</label>
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(selectedTask.due_date)}</span>
                  </div>
                </div>

                <div>
                  <label className="text-blue-900 font-semibold text-sm block mb-2">Task Type</label>
                  <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-xl">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {selectedTask.group_details 
                        ? `${selectedTask.group_details.name} (${selectedTask.group_details.member_count} members)` 
                        : 'Group Task'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-blue-900 font-semibold text-sm block mb-2">Update Status</label>
                <select
                  value={selectedTask.status}
                  onChange={(e) => handleStatusUpdate(selectedTask.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTaskDetail(false)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeProject;