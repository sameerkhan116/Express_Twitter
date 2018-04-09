import route from 'express';

import Tweet from '../models/tweet';

const router = route.Router();

/*
  Rendering the home page available at main/landing
  Getting the tweets based on the model and using mongoose to
  automatically poplulate the owner field. Also sort the data
  according to when it was created
*/
router.get('/', (req, res, next) => {
  req.user
    ? Tweet
      .find({})
      .sort('created')
      .populate('owner')
      .exec((err, tweets) => {
        console.log(tweets);
        res.render('main/home', {tweets});
      })
    : res.render('main/landing');
});

export default router;
