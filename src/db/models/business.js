'use strict';
module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define('Business', {
    shop_name: DataTypes.STRING,
    location: DataTypes.STRING,
    opining_Time: DataTypes.TIME,
    closing_Time: DataTypes.TIME,
    phone_number: DataTypes.STRING,
    menu: DataTypes.STRING
  }, {});
  Business.associate = function(models) {
    // associations can be defined here
  };
  return Business;
};