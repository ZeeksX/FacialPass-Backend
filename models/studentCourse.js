// models/studentCourse.js
export default (sequelize, DataTypes) => {
  const StudentCourse = sequelize.define(
    "StudentCourse",
    {
      student_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Students", // Assuming your student table is named 'Students'
          key: "id",
        },
      },
      course_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Courses", // Assuming your course table is named 'Courses'
          key: "id",
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "StudentCourses", // Ensure this matches your actual table name
    }
  );

  return StudentCourse;
};
