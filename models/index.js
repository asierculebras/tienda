
var path = require('path');

// Cargar ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite:
//    DATABASE_URL = sqlite:///
//    DATABASE_STORAGE = producto.sqlite
// Usar BBDD Postgres:
//    DATABASE_URL = postgres://user:passwd@host:port/database

var url, storage;

if (!process.env.DATABASE_URL) {
    url = "sqlite:///";
    storage = "tienda.sqlite";
} else {
    url = process.env.DATABASE_URL;
    storage = process.env.DATABASE_STORAGE || "";
}

var sequelize = new Sequelize(url, 
	 						  { storage: storage,
				              	omitNull: true 
				              });

// Importar la definicion de la tabla Quiz de quiz.js
var Producto = sequelize.import(path.join(__dirname,'producto'));

// Importar la definicion de la tabla Usuarios de User.js
var User = sequelize.import(path.join(__dirname,'user'));

// Importar la definicion de la tabla Usuarios de Carrito.js
var Carrito = sequelize.import(path.join(__dirname,'carrito'));

//relaccion 1 a 1 entre los carritos y los usuarios que son los dependientes
User.hasOne(Carrito, {foreignKey: 'UserId'});
Carrito.belongsTo(User, {foreignKey: 'UserId'});


//relaccion N a N entre los carritos y los productos.
//Producto.belongsToMany(Carrito);


exports.Producto = Producto; // exportar definición de tabla Quiz
exports.User = User; // exportar definición de tabla DE LOS USUARIOS
exports.Carrito = Carrito;



