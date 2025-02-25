export default (sequelize, DataTypes) => {
  const Department = sequelize.define(
    "Department",
    {
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return Department; 
};
