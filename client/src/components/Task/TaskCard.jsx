import { useState } from "react";
import { FiEdit2, FiTrash2, FiCheck, FiClock } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Task Card Component
 * Displays individual task with action buttons
 * Handles status toggle, edit, and delete operations
 */
const TaskCard = ({ task, onEdit, onDelete, onToggleStatus, isAdmin }) => {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine if current user can modify this task
  const canModify = isAdmin || task.userId?._id === user?.id;

  const handleToggle = (e) => {
    e.stopPropagation();
    if (canModify) {
      onToggleStatus(task._id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (canModify) {
      onEdit(task);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (
      window.confirm("Are you sure you want to delete this task?") &&
      canModify
    ) {
      onDelete(task._id);
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "";
    }
  };

  return (
    <div
      className={`task-card ${task.status} ${getPriorityClass(task.priority)}`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="task-header">
        <button
          onClick={handleToggle}
          className={`status-btn ${task.status}`}
          title={
            task.status === "completed"
              ? "Mark as pending"
              : "Mark as completed"
          }
        >
          {task.status === "completed" ? <FiCheck /> : <FiClock />}
        </button>

        <div className="task-info">
          <h3
            className={`task-title ${task.status === "completed" ? "completed" : ""}`}
          >
            {task.title}
          </h3>
          <div className="task-meta">
            <span className={`priority-badge ${task.priority}`}>
              {task.priority}
            </span>
            {task.userId && (
              <span className="task-owner">by {task.userId.username}</span>
            )}
          </div>
        </div>

        {canModify && (
          <div className="task-actions">
            <button
              onClick={handleEdit}
              className="icon-btn edit"
              title="Edit task"
            >
              <FiEdit2 />
            </button>
            <button
              onClick={handleDelete}
              className="icon-btn delete"
              title="Delete task"
            >
              <FiTrash2 />
            </button>
          </div>
        )}
      </div>

      {isExpanded && task.description && (
        <div className="task-description">
          <p>{task.description}</p>
        </div>
      )}

      <div className="task-footer">
        <span className="task-date">
          Created: {new Date(task.createdAt).toLocaleDateString()}
        </span>
        <span className={`task-status-badge ${task.status}`}>
          {task.status}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
