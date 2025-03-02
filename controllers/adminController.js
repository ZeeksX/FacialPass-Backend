// controllers/adminController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin, Student, Course, StudentCourse } from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

// Register a new admin
export const registerAdmin = async (req, res) => {
  try {
    const { firstname, lastname, staff_id, email, office, password } = req.body;
    // Check if admin already exists by email or staff_id
    const existingAdminByEmail = await Admin.findOne({ where: { email } });
    const existingAdminByStaffId = await Admin.findOne({ where: { staff_id } });

    if (existingAdminByEmail || existingAdminByStaffId) {
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
    res.status(500).json({ message: "Error registering admin", error });
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
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get admin dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.count();
    const totalCourses = await Course.count();
    res.json({ totalStudents, totalCourses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats", error });
  }
};

// Get all registered students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};

// Get all registered courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({ include: [Student] });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};
