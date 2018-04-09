import colors from 'colors';
import async from 'async';

import Tweet from '../models/tweet';
import User from '../models/user';
/*
  Set up socket io to work on connection
  This file will be imported in the server
*/
export default io => {
  io.on('connection', socket => {
    console.log('Socket.io: '.green.bold + "Connected!".cyan);
    // user can now be accessed at socket.request
    const {user} = socket.request;
    console.log('Current user: '.magenta.bold + user.name.cyan);

    /*
      Get the data from the channel name on which we emitted in custom.js.
      emit this data back with user information to be rendered on the frontend and also
      await response from pushing this data in our db models.
    */
    socket.on('tweet', async({content}) => {
      io.emit('incomingTweets', {content, user});
      let tweet = new Tweet({content, owner: user._id});
      await Promise.all([
        await tweet.save(),
        await User.update({
          id: user._id
        }, {
          $push: {
            tweets: {
              tweet: tweet._id
            }
          }
        })
      ])
    })
  });
};