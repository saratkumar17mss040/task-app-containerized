import axios from "axios";

/**
 * API Service Configuration
 * Creates axios instance with base URL and interceptors
 * Handles JWT token attachment and response errors
 */
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Attach JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

/**
 * Auth API Service
 * Handles authentication-related API calls
 */
export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (username, email, password) =>
    api.post("/auth/register", { username, email, password }),
  getMe: () => api.get("/auth/me"),
};

/**
 * Task API Service
 * Handles task CRUD operations with query parameters
 */
export const taskService = {
  getTasks: (params = {}) => api.get("/tasks", { params }),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (taskData) => api.post("/tasks", taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  toggleTaskStatus: (id) => api.patch(`/tasks/${id}/toggle`),
};

/**
 * User Management API Service (Admin)
 * Handles admin-level user management operations
 */
export const userService = {
  getUsers: () => api.get("/users"),
  updateUserRole: (userId, role) =>
    api.patch(`/users/${userId}/role`, { role }),
};

export default api;
