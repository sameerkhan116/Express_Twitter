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
const cookieParser = require('cookie-parser');

const config = require('./config/secret');
const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');

const PORT = 3000;
const app = express();

mongoose.connect(config.database, err => {
  if (err) 
    console.log(err);
  console.log('Connected to the database!');
});

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.secret,
  store: new mongoStore({url: config.database, autoReconnect: true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
})

app.use(mainRoutes);
app.use(userRoutes);

app.listen(PORT, err => {
  if (err) 
    console.log(err);
  console.log(`Running on http://localhost:${PORT}`);
});
