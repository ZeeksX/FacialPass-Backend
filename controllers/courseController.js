import { Course, Student } from "../models/index.js";

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error });
  }
};

// Get students in a course
export const getStudentsInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByPk(courseId, { include: [Student] });
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course.Students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};
