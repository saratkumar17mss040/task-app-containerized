const { body } = require("express-validator");

/**
 * Validation rules for creating and updating tasks
 * Ensures task data meets specified requirements
 */
const taskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ max: 200 })
    .withMessage("Title cannot exceed 200 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("status")
    .optional()
    .isIn(["pending", "completed"])
    .withMessage("Status must be either pending or completed"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priority must be low, medium, or high"),
];

module.exports = { taskValidation };
