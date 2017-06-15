
var models = require('../models');
var Sequelize = require('sequelize');
var async = require('async');
var url = require('url');



exports.create = function(req, res, next) {

  console.log("SAAAAAAAAAAA");

var redir = req.body.redir || '/'

  console.log("EL REDIR ES "+ redir);

  console.log("ENTRA EN FUNCTION 1");


var login     = req.body.login;
var user = "";
var cajero = "";
console.log("EL LOGIN PARA BUSCAR EL USER ES " + login);

models.User.findOne({where: {username: login}},{include: [models.Carrito]})
    .then(function(user) { 
         var user = user;
           console.log("CONSIGO este user " + user);
           console.log("ESTE ES EL USER" +user);
           var cajero = user.username;
           var userId = user.id;
           console.log("ENTRA EN FUNCTION 2");
           console.log("EL USERID DEL cajero QUE TIENE EL CALLBACK ES: " + userId);
           console.log("EL MOMBRE DEL cajero QUE TIENE EL CALLBACK ES: " + cajero);


          var carrito = models.Carrito.build({cajero: cajero ,total:'0',UserId: userId})
                console.log("ENTRA EN FUNCTION 3");
                carrito.save({fields: ["cajero", "total", "UserId"]})
                 .then(function(carrito) {
                   //req.flash('success', 'Carrito creado con éxito.');
                    console.log("¡¡¡¡¡¡¡¡¡¡SE HA CREADO UN NUEVO CARRITO!!!!!!!!!!! " + carrito);
                    console.log("CON ID: " + carrito.id);
                    console.log("CON USERID: " + carrito.UserId);
                    console.log("Y EL CAJERO ES : " + carrito.cajero +" Y TOTAL: " + carrito.total);
                     res.redirect(redir); // redirección a redir

                    }) 
                    .catch(Sequelize.ValidationError, function(error) {
                      //req.flash('error', 'Error al crear un Comentario: ' + error.message);
                      console.log("%%%%%%%%%%%%%%%   ERROR EN EL FORM %%%%%%%%%%%%%%%");
                      res.render('/session');
                    })
                      .catch(function(error) {
                              console.log("ERROR AL INTENTAR GUARDAR LAS COSAS");
                              console.log(error)
                                     //next(error);
                            });  
        })
      .catch(function(error) {
        console.log("CAGADA");
        console.log(error)
               //next(error);
      });  

}



exports.destroy = function (req, res, next) {
var session = req.session;
console.log("la sesion uqe hay es   " + session);
var user = session;
console.log("EL USER ES   " + user);
var id = user.id;
console.log("EL ID ES   " + id);
var username = req.session.user.username ;
console.log("EL CAJERO DEL CARRITO QUE BUSCO ES  " + username);


models.Carrito.findOne({where: {cajero: username}})
    .then(function(carrito) {
        console.log("EL CARRITO ENCONTRADO ES: " + carrito.id);
      if (carrito) {
        console.log("EL CARRITO ENCONTRADO ES: " + carrito.id);
        carrito.destroy()
           .then(function () {
              console.log("SE HA BORRADO EL CARRITO");
              next();
              //res.redirect("/session"); // redirect a login
          })
          .catch(function (error) {
            console.log("error number 1");
              //next(error);
    });
      } else {
        throw new Error('No existe ese Carrito en la BBDD.');
      }
    })
    .catch(function(error) {
      console.log("error number 2");

      //next(error);
    }); 
};
