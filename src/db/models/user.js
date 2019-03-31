"use strict";
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",{
    hashedPassword: {
      type: DataTypes.STRING,
      field: "hashed_password",
      allowNull: false
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    car_pic: DataTypes.STRING,
    additional_info: DataTypes.STRING,
    phone_number: DataTypes.STRING,
  }, 
    {
      tableName: "users",
      hooks: {
        beforeCreate: function(user) {
          const hashCost = 10;
          user.hashedPassword = bcrypt.hashSync(user.hashedPassword, hashCost);
        }
      }
    })
  ;

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.hashedPassword);
  };

  User.prototype.bcrypt = function(password) {
    // authentication will take approximately 13 seconds
    // https://pthree.org/wp-content/uploads/2016/06/bcrypt.png
    const hashCost = 10;
    this.hashedPassword = bcrypt.hashSync(password, hashCost,);
    this.save();
  };
  
  User.associate = function(models) {
    User.hasMany(models.Business,{
    foreignKey: "user_id",
    as: "business"
  });
  };
  return User;
}