var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var partials = require('express-partials');
var flash = require('express-flash');

var routes = require('./routes/index');

var app = express();


// En produccion (Heroku) redirijo las peticiones http a https.
// Documentacion: http://jaketrent.com/post/https-redirect-node-heroku/
if (app.get('env') === 'production') {
    app.use(function(req, res, next) {
        if (req.headers['x-forwarded-proto'] !== 'https') {
            res.redirect('https://' + req.get('Host') + req.url);
        } else { 
            next() /* Continue to other routes if we're not redirecting */
        }
    });
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: "Tienda",
                 resave: false,
                 saveUninitialized: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method', {methods: ["POST", "GET"]}));
console.log("Se va a mostrar el favicon");

app.use(partials());
app.use(flash());

// Helper dinamico:
app.use(function(req, res, next) {

   // Hacer visible req.session en las vistas
   res.locals.session = req.session;  
// esto esta para que en el layout se vea si hay sesion o no.
//en res.loclas almacenmos todo lo que queramos usar en esta conexion, es como una cache. en este caso almacenamos la sesion para que:
//en todo el rato que navegamos la tengamos.
//en el layaout la utilizaremos solos llamando a sesion.

   // gestion de la busqueda globlal
   //res.locals.search = req.query.search || req.session.search || 'Escribe lo que buscas';
    //req.session.search = res.locals.search;
   next();
});



app.use('/', routes);





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
