
var models = require('../models');
var Sequelize = require('sequelize');

// Autoload el quiz asociado a :quizId
exports.load = function(req, res, next, productoId) {
	models.Producto.findById(productoId)
  		.then(function(producto) {
      		if (producto) {
        		req.producto = producto;
        		next();
      		} else { 
      			throw new Error('No existe productoId = ' + productoId);
      		}
        })
        .catch(function(error) { next(error); });
};


// GET /quizzes
exports.index = function(req, res, next) {
	models.Producto.findAll()
		.then(function(productos) {
			res.render('productos/index.ejs', { productos: productos});
		})
		.catch(function(error) {
			next(error);
		});
};


// GET /quizzes/:id
exports.show = function(req, res, next) {

	var session = req.session ;

	res.render('productos/show', {producto: req.producto,
								session: session});
};



// Post /productos/:productoId(\\d+)
exports.comprar = function(req, res, next) {
var username     = req.session.user.username;

var cantidad = req.body.cantidad

console.log("EL LOGIN PARA BUSCAR EL USER ES " + username);

models.Carrito.findOne({where: {cajero: username}})
    .then(function(carrito) { 
                var productoId = req.params.productoId;
                var cajero = carrito.cajero;
                var total = carrito.total;
                var userId = req.session.user.id;
                var productoId = "" + productoId;
                //var longitud = Object.keys(carrito.productos).length;
                //console.log("LA LONGITUD DEL PRODUCTO ES : " + longitud );
                //var igual = Object.keys(carrito.productos).length === 2;
                //console.log("IGUAL " + igual);
                console.log("EL CAJERO ES: " + carrito.cajero);

                console.log("EL PRODUCTO ID ES: " + productoId);
                console.log("EL EL JSON QUE tiene el CARRITO ES: " + JSON.stringify(carrito.productos));

                 if (carrito.productos === null){
                    console.log("HA ENTRADO AL IF");
                    var productos = {};
                    productos[productoId] = {'productoId': productoId, 'cantidad':cantidad};
                    console.log("EL EL JSON QUE meto en el CARRITO ES: " + JSON.stringify(productos));

              } else {
                console.log("HA ENTRADO AL ELSE");
                    var productos = carrito.productos;
                    var id = "" + productoId;
                    var aux = {'productoId': id, 'cantidad': cantidad};
                    console.log("PRODUCTOID ES : " + id);

                    console.log("EL EL JSON QUE tiene el CARRITO ES: " + JSON.stringify(productos));
                    console.log("EL EL JSON QUE QUIERO METER AL CARRITO ES: " + JSON.stringify(aux));

                   
                    productos[id] = aux;
// me falla aqui, no se como añadir otro {} al que ya habia antes, es decir no me lo actualiza.

                    //productos.id = [productoId, cantidad];
                   console.log("DENTRO DEL ELSE PRODUCTOS ES : " + JSON.stringify(productos));
              }
                console.log("EL EL JSON QUE VOY A METER A CARRITO ES: " + JSON.stringify(productos));

                carrito.updateAttributes({productos: productos})
                 .then(function(carrito) {

                      console.log("SE HA GUARDADO ESTOS PRODUCTOS " + JSON.stringify(carrito.productos));
                      precio = 'nada';
                      total = 


                     models.Producto.findAll()
                        .then(function(productos) {
                          res.render('productos/index.ejs', { productos: productos});
                        })
                        .catch(function(error) {
                          next(error);
                        });

                    }) 
                    .catch(Sequelize.ValidationError, function(error) {
                      //req.flash('error', 'Error al crear un Comentario: ' + error.message);
                      console.log("%%%%%%%%%%%%%%%   ERROR al actualizar CARRITO    %%%%%%%%%%%%%%%");
                      console.log(error);
                      res.render('/session');
                    })
                      .catch(function(error) {
                              console.log("ERROR AL INTENTAR GUARDAR LAS COSAS NUEVAS PARA EL CARRITO");
                              console.log(error)
                                     //next(error);
                            });  
        })
      .catch(function(error) {
        console.log("CAGADA");
        console.log(error)
               //next(error);
      });  

};



exports.indexCompra = function(req, res, next) {
  models.Producto.findAll()
    .then(function(productos) {
      res.render('productos/index.ejs', { productos: productos});
    })
    .catch(function(error) {
      next(error);
    });
};












// GET /quizzes/new
exports.new = function(req, res, next) {
  var producto = models.Producto.build({nombre: "", precio: ""});
  res.render('productos/new', {producto: producto});
  console.log("se ha creado un nuevo producto" + producto);
};



// POST /quizzes/create
exports.create = function(req, res, next) {

  console.log("ha entrdo al post y tiene esto: " + req.body.producto);

  var producto = models.Producto.build({ nombre: req.body.producto.nombre,
                                         precio: req.body.producto.precio} );

  // guarda en DB los campos pregunta y respuesta de quiz
  producto.save({fields: ["nombre", "precio"]})
  	.then(function(producto) {
    	res.redirect('/productos');  // res.redirect: Redirección HTTP a lista de preguntas
    })
    .catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

      res.render('producto/new', {producto: producto});
    })
    .catch(function(error) {
		req.flash('error', 'Error al crear un Quiz: '+error.message);
		next(error);
	});  
};


// GET /quizzes/:id/edit
exports.edit = function(req, res, next) {
  var producto = req.producto;  
  var nombre = req.producto.nombre;

  res.render('productos/edit', {producto: producto, nombre: nombre});
};


// PUT /quizzes/:id
exports.update = function(req, res, next) {

  req.producto.nombre = req.body.producto.nombre;
  req.producto.precio   = req.body.producto.precio;

  req.producto.save({fields: ["nombre", "precio"]})
    .then(function(producto) {
	  //req.flash('success', 'Producto editado con éxito.');
      res.redirect('/productos'); // Redirección HTTP a lista de preguntas.
    })
    .catch(Sequelize.ValidationError, function(error) {

      req.flash('error', 'Errores en el formulario:');
      for (var i in error.errors) {
          req.flash('error', error.errors[i].value);
      };

      res.render('productos/edit', {producto: req.producto});
    })
    .catch(function(error) {
	  req.flash('error', 'Error al editar el Producto: '+error.message);
      next(error);
    });
};


// DELETE /quizzes/:id
exports.destroy = function(req, res, next) {
  req.producto.destroy()
    .then( function() {
	  //req.flash('success', 'Producto borrado con éxito.');
      res.redirect('/productos');
    })
    .catch(function(error){
	  req.flash('error', 'Error al editar el Producto: '+error.message);
      next(error);
    });
};


