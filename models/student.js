//models/student.js
export default (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      matricNumber: { type: DataTypes.STRING, unique: true },
      department: DataTypes.STRING,
      email: { type: DataTypes.STRING, unique: true },
      facial_image: DataTypes.BLOB("long"), // Store image as binary data
      password: DataTypes.TEXT,
      role: {
        type: DataTypes.STRING,
        defaultValue: "student",
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return Student;
};
