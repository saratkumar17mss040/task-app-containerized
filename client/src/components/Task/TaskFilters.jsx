import { FiSearch } from "react-icons/fi";

/**
 * Task Filters Component
 * Provides filtering and search functionality for tasks
 * Includes status, priority filters and search input
 */
const TaskFilters = ({ filters, onFilterChange, onSearch }) => {
  const handleStatusChange = (status) => {
    onFilterChange({ status });
  };

  const handlePriorityChange = (e) => {
    onFilterChange({ priority: e.target.value });
  };

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <div className="task-filters">
      <div className="filter-group">
        <div className="status-filters">
          <button
            className={`filter-btn ${!filters.status ? "active" : ""}`}
            onClick={() => handleStatusChange("")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filters.status === "pending" ? "active" : ""}`}
            onClick={() => handleStatusChange("pending")}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filters.status === "completed" ? "active" : ""}`}
            onClick={() => handleStatusChange("completed")}
          >
            Completed
          </button>
        </div>

        <select
          value={filters.priority || ""}
          onChange={handlePriorityChange}
          className="priority-filter"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="search-group">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search || ""}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
    </div>
  );
};

export default TaskFilters;
