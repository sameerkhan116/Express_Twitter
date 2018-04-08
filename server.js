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
  passport: authentication middleware
  cookie-parser:
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
const passport = require('passport');

const config = require('./config/secret'); // environment variables

const mainRoutes = require('./routes/main'); // home routes
const userRoutes = require('./routes/user'); // signup/login routes

const PORT = 3000;
const app = express();

/*
  using mongoose to connect to connect to mongodb set up on mlabs.
  callback tells us if error or successful
*/
mongoose.connect(config.database, err => {
  if (err) 
    console.log(err);
  console.log('Connected to the database!');
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
  secret: config.secret,
  store: new mongoStore({url: config.database, autoReconnect: true}),
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
app.listen(PORT, err => {
  if (err) 
    console.log(err);
  console.log(`Running on http://localhost:${PORT}`);
});
