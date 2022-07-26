const DataTypes = require("sequelize").DataTypes;
const _user = require("./user");

function initModels(sequelize) {
  const USER = _user(sequelize, DataTypes);
  
  return {
    USER
  };
}

module.exports = initModels;
