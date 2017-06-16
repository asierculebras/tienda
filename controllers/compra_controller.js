
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
			var precio = req.query.precio || 'el que sea'
      
			res.render('compra/index.ejs', {precio: precio});
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


