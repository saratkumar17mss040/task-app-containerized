const express = require("express");
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
} = require("../controllers/task.controller");
const { authenticateToken } = require("../middleware/auth");
const { validate } = require("../middleware/validation");
const { taskValidation } = require("../validators/task.validators");

/**
 * Task Routes
 * CRUD operations for tasks with role-based access control
 * All routes require authentication
 */

// Apply authentication to all task routes
router.use(authenticateToken);

// Get all tasks with filtering, pagination, and search
router.get("/", getTasks);

// Get single task by ID
router.get("/:id", getTask);

// Create new task
router.post("/", taskValidation, validate, createTask);

// Update task
router.put("/:id", taskValidation, validate, updateTask);

// Delete task
router.delete("/:id", deleteTask);

// Toggle task status
router.patch("/:id/toggle", toggleTaskStatus);

module.exports = router;
