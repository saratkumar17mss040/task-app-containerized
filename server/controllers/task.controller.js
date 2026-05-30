const Task = require("../models/task");

/**
 * Get all tasks with filtering, pagination, and search
 * Supports role-based access: admins see all, users see their own
 */
exports.getTasks = async (req, res) => {
  try {
    const {
      status,
      priority,
      search,
      page = 1,
      limit = 10,
      sort = "-createdAt",
    } = req.query;

    // Build query based on user role
    let query = {};

    // Role-based filtering: users see only their tasks, admins see all
    if (req.user.role !== "admin") {
      query.userId = req.user._id;
    }

    // Filter by status if provided
    if (status && ["pending", "completed"].includes(status)) {
      query.status = status;
    }

    // Filter by priority if provided
    if (priority && ["low", "medium", "high"].includes(priority)) {
      query.priority = priority;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    // Execute query with pagination
    const tasks = await Task.find(query)
      .populate("userId", "username email")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

/**
 * Get single task by ID
 * Users can only access their own tasks, admins can access any task
 */
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "userId",
      "username email",
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Role-based access: users can only see their own tasks
    if (
      req.user.role !== "admin" &&
      task.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this task",
      });
    }

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching task",
      error: error.message,
    });
  }
};

/**
 * Create new task
 * All authenticated users can create tasks assigned to themselves
 */
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority = "medium" } = req.body;

    // Create task assigned to the authenticated user
    const task = await Task.create({
      title,
      description: description || "",
      priority,
      userId: req.user._id,
    });

    // Populate user data for response
    await task.populate("userId", "username email");

    res.status(201).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
};

/**
 * Update task
 * Users can update their own tasks, admins can update any task
 */
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    // Find task
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Role-based access: users can only update their own tasks
    if (
      req.user.role !== "admin" &&
      task.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    // Update fields if provided
    const updateFields = {};
    if (title) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) {
      console.log("Updating status to:", status);
      updateFields.status = status;
    }
    if (priority !== undefined) updateFields.priority = priority;

    // Update task
    task = await Task.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true,
    }).populate("userId", "username email");

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message,
    });
  }
};

/**
 * Delete task
 * Users can delete their own tasks, admins can delete any task
 */
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Role-based access: users can only delete their own tasks
    if (
      req.user.role !== "admin" &&
      task.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error.message,
    });
  }
};

/**
 * Toggle task status (completed/pending)
 * Convenience method for quickly toggling task completion
 */
exports.toggleTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Role-based access
    if (
      req.user.role !== "admin" &&
      task.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    // Toggle status
    task.status = task.status === "completed" ? "pending" : "completed";
    await task.save();

    await task.populate("userId", "username email");

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling task status",
      error: error.message,
    });
  }
};
