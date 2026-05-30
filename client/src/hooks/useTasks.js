import { useState, useEffect, useCallback } from "react";
import { taskService } from "../services/api";
import toast from "react-hot-toast";

/**
 * Custom hook for task management
 * Provides state and functions for CRUD operations on tasks
 * Handles pagination, filtering, and search
 */
export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });

  // Fetch tasks with current filters
  const fetchTasks = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: pagination.limit,
          ...filters,
        };

        // Remove empty filters
        Object.keys(params).forEach((key) => {
          if (!params[key]) delete params[key];
        });

        const response = await taskService.getTasks(params);
        setTasks(response.data.tasks);
        setPagination(response.data.pagination);
        setError(null);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit],
  );

  // Create task
  const createTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      toast.success("Task created successfully!");
      fetchTasks(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
      throw err;
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      await taskService.updateTask(id, taskData);
      toast.success("Task updated successfully!");
      fetchTasks(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      toast.success("Task deleted successfully!");
      fetchTasks(pagination.page);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete task");
      throw err;
    }
  };

  // Toggle task status
  const toggleTaskStatus = async (id) => {
    try {
      await taskService.toggleTaskStatus(id);
      toast.success("Task status updated!");
      fetchTasks(pagination.page);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update task status",
      );
      throw err;
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Change page
  const changePage = (page) => {
    fetchTasks(page);
  };

  // Initial fetch
  useEffect(() => {
    fetchTasks(1);
  }, [fetchTasks]);

  return {
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
    refreshTasks: () => fetchTasks(pagination.page),
  };
};
