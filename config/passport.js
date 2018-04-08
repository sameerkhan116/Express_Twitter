/*
  1. Get the passport library
  2. Get the local strategy from passport-local
  3. Get the user model from the model we created
*/
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

/*
  To maintain persistent login sessions. Authenticated user is serialized to the session.
*/
passport.serializeUser((user, done) => {
  done(null, user.id);
});

/*
  Deserialize user from session when logging out.
*/
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/*
  Passport uses authentication strategies to authenticate requests. Here we are creating a local strategy
  with name local login. We pass some options to LocalStrategy such as usernameField, password that we get
  from our form on the template. The pass req to callback options is to allow passing information to a callback
  where we can verify the user accordingly.
*/
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({
    email
  }, (err, user) => {
    if (err) 
      return done(err);
    if (!user) 
      return done(null, false, req.flash('loginMessage', 'No user found'));
    if (!user.comparePassword(password)) 
      return done(null, false, req.flash('loginMessage', 'Oops! Wrong Password'));
    return done(null, user);
  });
}));