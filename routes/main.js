const router = require('express').Router();
const User = require('../models/user');

router.get('/', (req, res, next) => {
  res.render('main/landing');
});

router.get('/create-new-user', (req, res, next) => {
  var user = new User();
  user.email = req.body.email;
  user.name = req.body.name;
  user.password = req.body.password;
  user.save(err => {
    if (err) 
      return next(err);
    res.json("Successfully created!");
  });
});

module.exports = router;
