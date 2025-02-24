export default (sequelize, DataTypes) => {
  const Department = sequelize.define(
    "Department",
    {
      name: { type: DataTypes.STRING, unique: true },
    },
    { timestamps: true }
  );

  return Department;
};
