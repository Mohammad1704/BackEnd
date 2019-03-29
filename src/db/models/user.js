"use strict";
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",{
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    car_pic: DataTypes.STRING,
    additional_info: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    password: DataTypes.STRING
  }, 
    {
      tableName: "users",
      hooks: {
        beforeCreate: user => {
          const hashCost = 10;
          user.password = bcrypt.hashSync(user.password, hashCost);
        }
      }
    })
  ;

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.prototype.bcrypt = function(password) {
    // authentication will take approximately 13 seconds
    // https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
    const hashCost = 10;
    this.password = bcrypt.hashSync(password, hashCost);
    this.save();
  };
  
  User.associate = function(models) {
    User.hasMany(models.Business,{
    foreignKey: "user_id",
    as:"business"
  });
  };
  return User;
}