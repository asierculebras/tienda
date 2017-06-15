'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.createTable(
           'Carritos', 
           { id:        { type: Sequelize.INTEGER,  allowNull: false,
                          primaryKey: true,         autoIncrement: true,  
                          unique: true },
             cajero:  { type: Sequelize.STRING,
                          validate: { notEmpty: {msg: "falta un nombre"} } },
             total:    { type: Sequelize.INTEGER,
                          validate: { notEmpty: {msg: "Poner el precio"} } },
             productos:  { type: Sequelize.JSON,
                          validate: { notEmpty: {msg: "falta una lista"} } },            
             createdAt: { type: Sequelize.DATE,     allowNull: false },
             updatedAt: { type: Sequelize.DATE,     allowNull: false }
           },
           { sync: {force: true}
           }
      );
  },
  down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('Carritos');
  }
};