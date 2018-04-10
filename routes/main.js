import route from 'express';

import Tweet from '../models/tweet';
import User from '../models/user';

const router = route.Router();

/*
  Rendering the home page available at main/landing
  Getting the tweets based on the model and using mongoose to
  automatically poplulate the owner field. Also sort the data
  according to when it was created
*/
router.get('/', async(req, res, next) => {
  if (req.user) {
    const tweets = await Tweet
      .find({})
      .sort({'created': -1})
      .populate('owner');
    console.log(tweets);
    res.render('main/home', {tweets});
  } else 
    res.render('main/landing');
  }
);

router.get('/user/:id', async(req, res, next) => {
  const tweets = await Tweet
    .find({owner: req.params.id})
    .populate('owner');

  const user = await User
    .findOne({_id: req.params.id})
    .populate('following')
    .populate('followers');

  res.render('main/user', {user, tweets})
});

router.post('/follow/:id', async(req, res, next) => {
  console.log(req.user);
  const follower = await User.update({
    _id: req.user._id,
    following: {
      $ne: req.params.id
    }
  }, {
    $push: {
      following: req.params.id
    }
  });

  const following = await User.update({
    _id: req.params.id,
    followers: {
      $ne: req.user._id
    }
  }, {
    $push: {
      followers: req.user._id
    }
  });

  await Promise
    .all([follower, following])
    .then(res.json("success"))
    .catch(err => console.log(err));
})

export default router;
