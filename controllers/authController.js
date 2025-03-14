//controllers/authController.js
import { Student, Course, ExamAuthentication } from "../models/index.js";

// Verify student details
export const verifyStudent = async (req, res) => {
  try {
    const { firstname, lastname, courseId } = req.body;

    // Find student
    const student = await Student.findOne({
      where: { firstname, lastname },
      include: [
        {
          model: Course,
          through: { attributes: [] }, // Hide join table data
        },
      ],
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if student is registered for the course
    const isRegistered = student.Courses.some(
      (course) => course.id === courseId
    );

    if (!isRegistered) {
      return res.status(403).json({
        success: false,
        isRegistered: false,
        message: "Student is not registered for this course",
      });
    }

    return res.json({
      success: true,
      isRegistered: true,
      message: `Authenticated: ${student.firstname} ${student.lastname}`,
      student: {
        firstname: student.firstname,
        lastname: student.lastname,
        matricNumber: student.matricNumber,
        department: student.department,
      },
    });
  } catch (error) {
    console.error("Error authenticating student:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
};

// Save authentication details
export const saveAuthenticationDetails = async (req, res) => {
  try {
    const { matricNumber, courseCode, courseName, imageData, firstname, lastname } = req.body;

    // Ensure student exists before saving authentication details
    const student = await Student.findOne({ where: { matricNumber } });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if the student is already authenticated for this course
    const existingAuthRecord = await ExamAuthentication.findOne({
      where: { matricNumber, courseCode },
    });

    if (existingAuthRecord) {
      return res.status(409).json({
        success: false,
        message: "Student has already been authenticated for this course",
      });
    }

    // Get current date and time
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = now.toTimeString().split(" ")[0]; // HH:MM:SS

    // Ensure imageData is a base64 string
    if (!imageData || typeof imageData !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid image data. Expected a base64 string.",
      });
    }

    // Create a new record in the ExamAuthentication table
    const authRecord = await ExamAuthentication.create({
      matricNumber,
      courseCode,
      studentName: `${student.firstname} ${student.lastname}`,
      courseName,
      facial_image: imageData, // Save the base64 string directly
      date,
      time,
    });

    res.status(201).json({
      success: true,
      message: "Authentication details saved successfully",
      data: authRecord.toJSON(), // Return the saved record
    });
  } catch (error) {
    console.error("Error saving authentication details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save authentication details",
    });
  }
};
