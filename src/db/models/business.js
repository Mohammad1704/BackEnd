'use strict';
module.exports = (sequelize, DataTypes) => {
  const business = sequelize.define('Business', {
    shop_name: DataTypes.STRING,
    location: DataTypes.STRING,
    opining_time: DataTypes.STRING,
    closing_time: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    menu: DataTypes.STRING
  }, {tableName: "businesses" });
  business.associate = function(models) {
    business.belongsTo(models.User ,{
      foreignKey: "user_id",
      as: "business"
    });
  };
  return business;
};