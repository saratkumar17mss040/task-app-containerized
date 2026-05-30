const express = require("express");
const router = express.Router();
const { getUsers, updateUserRole } = require("../controllers/user.controller");
const { authenticateToken, authorize } = require("../middleware/auth");

/**
 * User Management Routes (Admin only)
 * Handles user role management and user listing
 * All routes require admin privileges
 */

// Apply authentication and admin authorization to all routes
router.use(authenticateToken);
router.use(authorize("admin"));

// Only users with admin role can access these routes. Only admins can view all users and update user roles.

// Get all users
router.get("/", getUsers);

// Update user role
router.patch("/:id/role", updateUserRole);

module.exports = router;
