var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs= require('express-handlebars');
var fileUpload= require('express-fileupload');
var session = require('express-session');


var indexRouter = require('./routes/index');
var institutionRouter = require('./routes/institution');
var tutorRouter = require('./routes/tutor');
var studentRouter = require('./routes/student');


var db=require('./config/connection')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs',hbs({extname:'hbs',defautLayout:'layout',layoutsDir:__dirname+'/views/layout',partialsDir:__dirname+'/views/partials/'}))   //Here we set the layout and partial
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.use(session({secret:'vcproject', cookie :{maxAge : 1200000}}));
db.connect((err)=>{
  if(err) console.log('Error occured'+ err)

  else console.log('Database connected to the port 27017')
})

app.use('/', indexRouter);
app.use('/institution', institutionRouter);
app.use('/tutor', tutorRouter);
app.use('/student', studentRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
