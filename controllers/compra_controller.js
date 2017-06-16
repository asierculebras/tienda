
var models = require('../models');
var Sequelize = require('sequelize');
var braintree = require('braintree');

var bodyParser = require('body-parser');
var parseUrlEnconded = bodyParser.urlencoded({
  extended: false
});

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: 'wps6ywdjkwhdcxh2',
  publicKey: '45yd4hn34wspm2vd',
  privateKey: '15cb15468dde3adac963a54d53c79001'
});




// GET /compra
exports.index = function(req, res, next) {
			var precio = 0;
      var username = req.session.user.username;
      var productos_totales = {};
      var json_productos; 
      var ids_productos ;

        models.Carrito.findOne({where: {cajero: username}})
            .then(function(carrito) { 
               json_productos = JSON.parse(carrito.productos);
               var ids = Object.keys(json_productos);
               console.log("ids " + ids);
              console.log("JSON Productos " + JSON.stringify(json_productos)); 

                /*
            // Obteniendo todas las claves ( es decir las id's de los productos) del JSON
                for (first_id in json_productos){

            // Controlando que json realmente tenga esa propiedad
                  if (json_productos.hasOwnProperty(first_id)) {
                     var json_interno = json_productos[first_id];
                     console.log("json_interno " + JSON.stringify(json_interno));
                           var productoId = json_interno.productoId;
                           var cantidad = parseInt(json_interno.cantidad);s
                           console.log("producto id " +productoId);
                           console.log("cantidad " + cantidad);
                    }
                  } */
                           models.Producto.findAll({where: {id :[ids]}})
                           .then(function(productos) {
                                          productos.forEach(function (producto) { 
                                          console.log("producto " + producto.nombre);  
                                          var id_producto = producto.id;
                                          var cantidad = json_productos[id_producto].cantidad;
                                          console.log("cantidad " + producto.nombre); 

                                        var precio_producto = producto.precio;
                                        console.log("ha encontrado el producto " + producto.nombre + ", con un precio de: " + precio_producto);
                                        precio = precio + parseInt(producto.precio * cantidad);
                                        precioTotal = parseInt(producto.precio * cantidad);  
                                        if (productos_totales === undefined || productos_totales === null || Object.keys(productos_totales).length <= 0){
                                            productos_totales[id_producto] = {'nombre': producto.nombre, 'cantidad': cantidad , 'precio': producto.precio, 'precioTotal':precioTotal};

                                        } else {
                                          var futureJson = productos_totales;
                                          futureJson[id_producto.toString()] = {'nombre': producto.nombre, 'cantidad': cantidad , 'precio':producto.precio, 'precioTotal':precioTotal};
                                          productos_totales = futureJson;
                                        }
                                        
                                        ids_productos = [Object.keys(productos_totales)];      


                                        // me he quedado aquí por imbecil!!!  
                                      })
                                        console.log("el precio es: "+ precio);
                                        console.log("la lista de productos_totales es " + JSON.stringify(productos_totales));   
                                      })
                           .then(function(productos) {
                              console.log("el precio es: "+ precio);
                  console.log("EL JSON FINAL ES: productos_totales es " + JSON.stringify(productos_totales)); 
                  console.log("LAS IDS DE LOS PRODUCTOS QUE HAY ALMACENADOS SON : " + ids_productos); 
                  res.render('compra/index.ejs', {precio: precio, productos_totales: productos_totales, ids_productos: ids_productos});
                           })
                                    

                  
      
        })
        .catch(function(error) {
          console.log(error); next(error);
        });
      // queir coger las id de productos, las cantidades del carrito
      // aceder a productos con esa ide sacar el precio
      // multiplicar el pecrio por la cantiad y generar el precio que paso como variable.  
      // y almacenar en un array o en un json los productos para pasarlo como parametro y en el view recorrerlo.  

                
};




// GET /quizzes/:id
exports.generar = function(req, response, next) {
var clientToken = '';
var precio = req.query.precio;

  gateway.clientToken.generate({}, function (err, res) {
     clientToken = res.clientToken
       console.log ("Token generado es:  " + clientToken);
       response.render('compra/generar.ejs', {precio: precio, clientToken: clientToken});
  });

  console.log ("Token que voy a pasar es: " + clientToken);
		
	
};


