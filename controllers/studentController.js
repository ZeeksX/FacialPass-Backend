//controllers/studentController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Student, Course, StudentCourse } from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();

// Register a new student with file upload
export const registerStudent = async (req, res) => {
  console.log(req.body); // Log body
  console.log(req.file); // Log file object to confirm it's being received

  try {
    const { firstname, lastname, department, matricNumber, email, password } =
      req.body;

    // Check if student exists
    const existingStudent = await Student.findOne({ where: { matricNumber } });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Extract only the file name
    const facialImageName = req.file ? req.file.filename : null;

    // Create student
    const student = await Student.create({
      firstname,
      lastname,
      matricNumber,
      department,
      email,
      facial_image: facialImageName, // Save only file name
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Student registered successfully", student });
  } catch (error) {
    console.error("Error registering student:", error);
    res
      .status(500)
      .json({ message: "Error registering student", error: error.message });
  }
};

// Student login
export const loginStudent = async (req, res) => {
  try {
    const { matricNumber, password } = req.body;

    const student = await Student.findOne({ where: { matricNumber } });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: student.id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token, student });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Get student dashboard info
// export const getStudentDetails = async (req, res) => {
//   try {
//     const student = await Student.findByPk(req.user.id, { include: [Course] });
//     if (!student) return res.status(404).json({ message: "Student not found" });

//     const totalCourses = student.Courses.length;
//     res.json({ student, totalCourses });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching student details", error });
//   }
// };
export const getStudentDetails = async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.id, {
      include: [
        {
          model: Course,
          attributes: [
            "id",
            "course_name",
            "course_code",
            "semester",
            "credit_unit",
            "examDate",
          ],
          through: { attributes: [] }, // Exclude join table attributes
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      student: {
        firstname: student.firstname,
        lastname: student.lastname,
        matricNumber: student.matricNumber,
        department: student.department,
        email: student.email,
      },
      courses: student.Courses, // Includes exam dates now!
      totalCourses: student.Courses.length,
    });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Error fetching student details", error });
  }
};

// Register courses for semester
export const registerCourses = async (req, res) => {
  try {
    const { courseIds } = req.body;
    const studentId = req.user.id;

    const courses = await Course.findAll({ where: { id: courseIds } });
    if (courses.length !== courseIds.length) {
      return res.status(400).json({ message: "Invalid course selection" });
    }

    await StudentCourse.bulkCreate(
      courseIds.map((courseId) => ({ studentId, courseId }))
    );

    res.json({ message: "Courses registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering courses", error });
  }
};
