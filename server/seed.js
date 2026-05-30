const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const User = require("./models/user");

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Delete existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create normal user
    const normalUser = await User.create({
      username: "demo_user",
      email: "demo@example.com",
      password: await bcrypt.hash("Demo123", 10),
      role: "user",
    });
    console.log("Created demo user:", normalUser.email);

    // Create admin user
    const adminUser = await User.create({
      username: "admin",
      email: "admin@demo.com",
      password: await bcrypt.hash("Admin123", 10),
      role: "admin",
    });
    console.log("Created admin user:", adminUser.email);

    console.log("\nDemo Credentials:");
    console.log("─────────────────────────────");
    console.log("User:  demo@example.com");
    console.log("Pass:  Demo123");
    console.log("Role:  user");
    console.log("─────────────────────────────");
    console.log("Admin: admin@demo.com");
    console.log("Pass:  Admin123");
    console.log("Role:  admin");
    console.log("─────────────────────────────");

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedUsers();
