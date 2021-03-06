require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const User = require('./models/user');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


// require routes
const index     = require('./routes/index');
const reviews   = require('./routes/reviews');
const posts     = require('./routes/posts');

const app = express();

//connect to database
mongoose.connect('mongodb://localhost:27017/mg-electronica', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we\'re connected!');
});

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// setup public assets directory
app.use(express.static('public'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Configure Passport and Session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'Hang in there..',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// CHANGE: USE "createStrategy" INSTEAD OF "authenticate"
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set local variables middleware
app.use(function(req, res, next) {
  req.user = {
    '_id': '5d65e75889cdc731549a87fe',
    'username': 'fede'
  }
  res.locals.currentUser = req.user;
  // SET DEFAULT PAGE TITLE
  res.locals.title = 'MG Electrónica';
  // SET SUCCESS FLASH MESSAGE
  res.locals.success = req.session.success || '';
  // delete the success property off of the req.session object
  delete req.session.sucess;
  // SET ERROR FLASH MESSAGE
  res.locals.error = req.session.error || '';
  delete req.session.error;
  // continue on to next function in middleware chain
  next();
});

// Mount routes
app.use('/', index);
app.use('/posts', posts);
app.use('/posts/:id/reviews', reviews);


//Basic middleware for allowing me to pass an error to the next middleware
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // // render the error page
  // res.status(err.status || 500);
  // res.render('error');
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});

module.exports = app;
