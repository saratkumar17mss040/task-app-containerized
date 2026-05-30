const mongoose = require("mongoose");

/**
 * Task Schema
 * Defines the structure for task documents in MongoDB
 * Includes references to the User model for ownership
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Index for efficient querying by user and status
 * Improves performance for common queries
 */
taskSchema.index({ userId: 1, status: 1 });
taskSchema.index({ title: "text", description: "text" });

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
