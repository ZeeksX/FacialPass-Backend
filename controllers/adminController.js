// controllers/adminController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin, Student, Course } from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

// Register a new admin
export const registerAdmin = async (req, res) => {
  try {
    const { firstname, lastname, staff_id, email, office, password } = req.body;

    // Check if admin already exists by email or staff_id
    const existingAdmin = await Admin.findOne({
      where: { [Op.or]: [{ email }, { staff_id }] },
    });

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      firstname,
      lastname,
      staff_id,
      email,
      office,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (error) {
    console.error("Error registering admin:", error);
    return res.status(500).json({ message: "Error registering admin", error });
  }
};

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return success response
    res.json({ message: "Login successful", token, admin });
  } catch (error) {
    console.error("Error logging in admin:", error);
    return res.status(500).json({ message: "Error logging in", error });
  }
};

// Get admin dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const totalCourses = await Course.count();
    res.json({ totalStudents, totalCourses });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({ message: "Error fetching stats", error });
  }
};

// Get all registered students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return res.status(500).json({ message: "Error fetching students", error });
  }
};

// Get all registered courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({ include: [Student] });
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return res.status(500).json({ message: "Error fetching courses", error });
  }
};

// Get admin details
export const getAdminDetails = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.user.id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      admin: {
        firstname: admin.firstname,
        lastname: admin.lastname,
        office: admin.office,
        staff_id: admin.staff_id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Error fetching admin details:", error);
    return res
      .status(500)
      .json({ message: "Error fetching admin details", error });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.user?.id;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Both current and new passwords are required" });
    }

    // Find the admin by ID
    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare the current password with the stored hash
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Prevent reusing the same password
    const isSamePassword = await bcrypt.compare(newPassword, admin.password);
    if (isSamePassword) {
      return res
        .status(400)
        .json({
          message: "New password must be different from the current password",
        });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the admin's password
    await admin.update({ password: hashedNewPassword });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
