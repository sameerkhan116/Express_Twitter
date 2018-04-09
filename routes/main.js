import route from 'express';

const router = route.Router();

/*
  Rendering the home page available at main/landing
*/
router.get('/', (req, res, next) => {
  req.user
    ? res.render('main/home')
    : res.render('main/landing');
});

export default router;
