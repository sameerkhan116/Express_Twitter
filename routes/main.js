import route from 'express';

import Tweet from '../models/tweet';

const router = route.Router();

/*
  Rendering the home page available at main/landing
  Getting the tweets based on the model and using mongoose to
  automatically poplulate the owner field. Also sort the data
  according to when it was created
*/
router.get('/', async(req, res, next) => {
  if (req.user) {
    let tweets = await Tweet
      .find({})
      .sort({'created': -1})
      .populate('owner');
    console.log(tweets);
    res.render('main/home', {tweets});
  } else 
    res.render('main/landing');
  }
);

export default router;
