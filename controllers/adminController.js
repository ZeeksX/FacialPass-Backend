import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Admin, Student, Course, StudentCourse } from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

// Admin login
export const loginAdmin = async (req, res) => {
  try {
    const { staffId, password } = req.body;

    const admin = await Admin.findOne({ where: { staffId } });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

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
