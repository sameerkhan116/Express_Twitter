import colors from 'colors';
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
      Get the data from the channel name on which we emitted in custom.js
    */
    socket.on('tweet', data => {
      console.log(data);
    })
  });
};