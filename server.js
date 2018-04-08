/*
  express: minimalist framework for node.js
  body-parser: to make incoming request bodies avaialble as req.body (usually for forms)
  morgan: for logging HTTP requests in console
  mongoose: used to connect to a mongodb
  hbs: for templating
  express-handlebars: handlebars view engine for express
  session: to create a session for users
  mongoStore: to store session information server-side
  flash: to flash messages to user
  cookieParser: to read and write cookies to req.cookie
  passport: authentication middleware
  passport.socketio: for connecting passport with socket.io
*/
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const hbs = require('hbs');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportSocketIo = require('passport.socketio');
const colors = require('colors');

const config = require('./config/secret'); // environment variables

const mainRoutes = require('./routes/main'); // home routes
const userRoutes = require('./routes/user'); // signup/login routes

/*
  Some constants required in the server
  1. PORT for the port server will be listening on
  2. app is express represented as a function
  3. store is the mongostore that we created on mlabs
  4. secret is the secret key we use in the application
*/
const PORT = 3000;
const app = express();
const store = new mongoStore({url: config.database, autoReconnect: true});
const {secret} = config;

/*
  Setting up http for app that will be passed to socket.io
  also import the io.js file that we setup and pass it the io constant
  we created using socket.io and http
*/
const http = require('http').Server(app);
const io = require('socket.io')(http);
require('./realtime/io')(io);

/*
  Success and fail functions are needed for socket.io to make sure we are connected.cookieParser
*/
const success = (data, accept) => {
  console.log('Passport.socketio: '.green.bold + 'Successful Connection!'.cyan);
  accept();
}

const fail = (data, message, error, accept) => {
  console.log('Passport.socketio: '.red.bold + 'Failed Connection...'.red);
  if (error) {
    accept(new Error(message));
  }
}

/*
  Authorizing socket.io to use the session of passport
    • cookieParser for parsing cookies in this request
    • key for the current session
    • the secret that we used for the session
    • the store where session is stored
    • a success function
    • a fail function
*/
io.use(passportSocketIo.authorize({
  cookieParser,
  key: 'connect.sid',
  secret,
  store,
  success,
  fail
}));

/*
  using mongoose to connect to connect to mongodb set up on mlabs.
  callback tells us if error or successful
*/
mongoose.connect(config.database, err => {
  if (err) 
    console.log(err);
  console.log('MongoDB: '.green.bold + 'Connected to the database!'.cyan);
});

// setting the app view engine
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');
// for serving static files in express. all files will automically get the
// /public prefix
app.use(express.static(__dirname + '/public'));
// for dev purposes
app.use(morgan('dev'));
/*
  parse the entire body portion of an incoming request stream and exposes it on req.body in json
  also support parsing of application / x - www - form - urlencoded post data
*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
/*
  save session with certain options:
    • resave: force the last session to be saved back to session store even if there were no changes
    • saveUnitialized: Forces a session that is "uninitialized" to be saved to the store. A session is uninitialized when it is new but not modified.
    • secret: require option - used to sign the session ID cookie
*/
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret,
  store,
  cookie: {
    secure: true
  }
}));
app.use(flash()); // flash middleware to flash messages
/*
  Initialize passport middleware and authenticate the current session.
  passport.session() helps in persistent login
*/
app.use(passport.initialize());
app.use(passport.session());
/*
  Pass the user as a middleware so it is available everywhere as req.user
*/
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
})

// use these routers in app
app.use(mainRoutes);
app.use(userRoutes);

// start server
http.listen(PORT, err => {
  if (err) 
    console.log(err);
  console.log(`Running on http://localhost:${PORT}...`.yellow.bold.underline);
});
