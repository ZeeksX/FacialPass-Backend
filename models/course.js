export default (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      course_code: { type: DataTypes.STRING, unique: true },
      course_name: DataTypes.STRING,
      semester: DataTypes.STRING,
      credit_unit: DataTypes.INTEGER,
    },
    { timestamps: true }
  );

  return Course;
};
