import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useAuth } from "../contexts/AuthContext";
import TaskCard from "../components/Task/TaskCard";
import TaskForm from "../components/Task/TaskForm";
import TaskFilters from "../components/Task/TaskFilters";
import Pagination from "../components/Task/Pagination";
import { FiPlus } from "react-icons/fi";

/**
 * Dashboard Page Component
 * Main task management interface
 * Displays tasks with CRUD operations, filtering, and pagination
 */
const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const {
    tasks,
    loading,
    error,
    pagination,
    filters,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    updateFilters,
    changePage,
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    if (editingTask) {
      await updateTask(editingTask._id, formData);
    } else {
      await createTask(formData);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleSearch = (searchTerm) => {
    updateFilters({ search: searchTerm });
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2>My Tasks</h2>
          <p className="welcome-text">
            Welcome back, {user?.username}!
            {isAdmin && <span className="admin-text"> (Admin)</span>}
          </p>
        </div>
        <button onClick={handleCreate} className="btn-primary create-btn">
          <FiPlus /> New Task
        </button>
      </div>

      <TaskFilters
        filters={filters}
        onFilterChange={updateFilters}
        onSearch={handleSearch}
      />

      {error && (
        <div className="error-banner">
          Error loading tasks. Please try again.
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No tasks found</h3>
          <p>
            {filters.search || filters.status || filters.priority
              ? "Try adjusting your filters"
              : "Create your first task to get started"}
          </p>
          {!filters.search && !filters.status && !filters.priority && (
            <button onClick={handleCreate} className="btn-primary">
              Create Task
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEdit}
                onDelete={deleteTask}
                onToggleStatus={toggleTaskStatus}
                isAdmin={isAdmin}
              />
            ))}
          </div>

          <Pagination pagination={pagination} onPageChange={changePage} />
        </>
      )}

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
