const { body } = require("express-validator");

/**
 * Validation rules for user registration
 * Ensures all required fields meet specified criteria
 */
const registerValidation = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    ),
];

/**
 * Validation rules for user login
 * Ensures email and password are provided
 */
const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { registerValidation, loginValidation };
