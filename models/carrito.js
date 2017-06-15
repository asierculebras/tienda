
// Definicion del modelo Producto:

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Carrito',
                          { cajero: { type: DataTypes.STRING,
                          	            validate: { notEmpty: {msg: "Falta poner un cajero"}}
                          	          },
                            total:   { type: DataTypes.INTEGER,
                                        validate: { notEmpty: {msg: "Hay que ponerle un total"}}
                                      },
                            productos: { type: DataTypes.JSON,
                                        validate: { notEmpty: {msg: "Hay que ponerle una lista de productos"}}
                             }

                          });
};