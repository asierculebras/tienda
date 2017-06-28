var express = require('express');
var router = express.Router();

var productoController = require('../controllers/producto_controller');
var userController = require('../controllers/user_controller');
var sessionController = require('../controllers/session_controller');
var compraController = require('../controllers/compra_controller');
var carritoController = require('../controllers/carrito_controller');

//var carritoController = require('../controllers/carrito_controller');




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tu supermercado' });
});

// Autoload de rutas que usen :quizId
router.param('productoId', productoController.load);  // autoload :productoId

router.param('userId', userController.load);  // autoload :userId

// Definición de rutas de los Productos
router.get('/productos',                     productoController.index);
router.get('/productos/:productoId(\\d+)',       productoController.show);
router.post('/productos/:productoId(\\d+)', productoController.comprar);

router.get('/productos/new',                 productoController.new);
router.post('/productos',                    productoController.create);
router.get('/productos/:productoId(\\d+)/edit',  productoController.edit);
router.put('/productos/:productoId(\\d+)',       productoController.update);
router.delete('/productos/:productoId(\\d+)',    productoController.destroy);


// Definición de rutas de Usuarios
router.get('/users',                    userController.index);   // listado usuarios
router.get('/users/:userId(\\d+)',      userController.show);    // ver un usuario
router.get('/users/new',                userController.new);     // formulario sign un
router.post('/users',                   userController.create);  // registrar usuario
router.get('/users/:userId(\\d+)/edit',  userController.edit);     // editar información de cuenta
router.put('/users/:userId(\\d+)',      userController.update);   // actualizar información de cuenta
router.delete('/users/:userId(\\d+)',    userController.destroy);  // borrar cuenta


// Definición de rutas de sesion
router.get('/session',    sessionController.new);     // formulario login
router.post('/session',   sessionController.create, carritoController.create);  // crear sesión
router.delete('/session',  carritoController.destroy, sessionController.destroy); // destruir sesión


router.get('/compra', compraController.index);
router.get('/generar', compraController.generar);
router.get('/url/:userId(\\d+)', compraController.url);
router.post('/url/:userId(\\d+)', compraController.process);
//router.get('/url', compraController.url);



module.exports = router;
