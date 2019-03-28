"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      shop_name: {
        type: Sequelize.STRING
      },
      Car_pic: {
        type: Sequelize.STRING
      },
      additional_info: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      menu: {
        type: Sequelize.STRING
      },
      hashedPassword: {
        type: Sequelize.STRING,
        field: "hashed_password",
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at"
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "updated_at"
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};
