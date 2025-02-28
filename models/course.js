export default (sequelize, DataTypes) => {
  const Course = sequelize.define(
    "Course",
    {
      course_code: { type: DataTypes.STRING, unique: true },
      course_name: DataTypes.STRING,
      semester: DataTypes.STRING,
      credit_unit: DataTypes.INTEGER,
      examDate: {
        type: DataTypes.DATE,
        allowNull: false,
        get() {
          // Convert UTC to local time
          const rawValue = this.getDataValue("examDate");
          return rawValue ? new Date(rawValue).toLocaleString() : null;
        },
      },
    },
    { timestamps: true }
  );

  return Course;
};
