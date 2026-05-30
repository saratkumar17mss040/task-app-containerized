const User = require("../models/user");

/**
 * Get all users (Admin only)
 * Returns list of all users with their roles
 */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort("-createdAt");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};

/**
 * Update user role (Admin only)
 * Allows admins to promote/demote users between roles
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    // Validate role
    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Must be user or admin",
      });
    }

    // Prevent admin from demoting themselves
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot change your own role",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user role",
      error: error.message,
    });
  }
};
