import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Student, Course, StudentCourse } from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

// Register a new student
export const registerStudent = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      matricNumber,
      department,
      email,
      password,
    } = req.body;

    // Check if student exists
    const existingStudent = await Student.findOne({ where: { matricNumber } });
    if (existingStudent)
      return res.status(400).json({ message: "Student already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create student
    const student = await Student.create({
      firstname,
      lastname,
      matricNumber,
      department,
      email,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Student registered successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Error registering student", error });
  }
};


// Student login with email and password
export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student by email
    const student = await Student.findOne({ where: { email } });
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { id: student.id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return success response
    res.json({ message: "Login successful", token, student });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
// Get student dashboard info
export const getStudentDetails = async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.id, { include: [Course] });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const totalCourses = student.Courses.length;
    res.json({ student, totalCourses });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student details", error });
  }
};

// Register courses for semester
export const registerCourses = async (req, res) => {
  try {
    const { courseIds } = req.body;
    const studentId = req.user.id;

    const courses = await Course.findAll({ where: { id: courseIds } });
    if (courses.length !== courseIds.length)
      return res.status(400).json({ message: "Invalid course selection" });

    await StudentCourse.bulkCreate(
      courseIds.map((courseId) => ({ studentId, courseId }))
    );

    res.json({ message: "Courses registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering courses", error });
  }
};