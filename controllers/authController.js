//controllers/authController.js
import { Student, Course } from "../models/index.js";
import ExamAuthentication from "../models/examAuthentication.js";
// Verify student details
export const verifyStudent = async (req, res) => {
  try {
    const { firstname, lastname, courseId } = req.body;

    // Check if the student exists and is registered for the course
    const student = await Student.findOne({
      where: { firstname, lastname },
      include: [
        {
          model: Course,
          through: { where: { course_id: courseId } },
        },
      ],
    });

    if (!student) {
      return res.status(403).json({
        success: false,
        message: "Student is not registered for this course",
      });
    }

    return res.json({
      success: true,
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
    return res
      .status(500)
      .json({ success: false, message: "Authentication error" });
  }
};

// Save authentication details
export const saveAuthenticationDetails = async (req, res) => {
  try {
    const { matricNumber, courseCode, courseName } = req.body;

    // Get current date and time
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const time = now.toTimeString().split(" ")[0]; // Format: HH:MM:SS

    // Create a new record in the ExamAuthentication table
    const authRecord = await ExamAuthentication.create({
      matricNumber,
      courseCode,
      courseName,
      date,
      time,
    });

    res.status(201).json({
      success: true,
      message: "Authentication details saved successfully",
      data: authRecord,
    });
  } catch (error) {
    console.error("Error saving authentication details:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save authentication details",
    });
  }
};
