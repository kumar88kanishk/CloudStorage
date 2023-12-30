const { DataTypes } = require('sequelize');

const attributes = {
  name: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  size: { type: DataTypes.INTEGER, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false },
  bucket: { type: DataTypes.STRING, allowNull: false },
};

const options = {
  timestamps: true,
};

module.exports = (sequelize) => {
  const model = sequelize.define('registry', attributes, options);

  return model;
};
