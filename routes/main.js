const router = require('express').Router();

/*
  Rendering the home page available at main/landing
*/
router.get('/', (req, res, next) => {
  res.render('main/landing');
});

module.exports = router;
