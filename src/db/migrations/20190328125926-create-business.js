'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('businesses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      shop_name: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      opining_time: {
        type: Sequelize.STRING
      },
      closing_time: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      menu: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
        references: {
          model: "users",
        }
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
    return queryInterface.dropTable('businesses');
  }
};