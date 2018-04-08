/*
  1. Get router from express.Router()
  2. Get user model that has been set up with mongoDB
  3. Get passport libraries.
  4. Get passport configuration that we just set up.
*/
const router = require('express').Router();
const User = require('../models/user');
const passport = require('passport');
const passportConfig = require('../config/passport');

/*
  For /signup endpoint.
  GET: Render the signup page and flash any errors if available.
  POST: On submitting the signup form. Check if the user with given email does exist.
        If existing user, flash error and redirect,
        otherwise user = new User with name and password as provided.
        Finally sve the user
*/
router
  .route('/signup')
  .get((req, res, next) => {
    res.render('accounts/signup', {
      message: req.flash('errors')
    })
  })
  .post((req, res, next) => {
    User.findOne({
      email: req.body.email
    }, (err, existingUser) => {
      if (existingUser) {
        req.flash('errors', 'Account with that email already exists.');
        res.redirect('/signup');
      } else {
        let user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.photo = user.gravatar();
        user.password = req.body.password;
        user.save(err => {
          // req.logIn(user, err => {
          if (err) 
            return next(err);
          res.redirect('/');
          // });
        });
      }
    });
  });

/*
  GET: If user is already logged in, then redirect to home else ask user to login
       Otherwise use passport login to check if user exists or if the password is correct.
  POST: Use local strategy to authenticate. redirect to home on success, login on failure and
        flash error messages if available.
*/
router
  .route('/login')
  .get((req, res, next) => {
    if (req.user) 
      res.redirect('/');
    res.render('accounts/login', {
      message: req.flash('loginMessage')
    });
  })
  .post(passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));

/*
  on logout, just logout which is available on req.logout thanks to passport
*/
router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
})

module.exports = router;