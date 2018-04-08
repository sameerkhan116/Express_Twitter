/*
  Set up socket io to work on connection
  This file will be imported in the server
*/
module.exports = io => {
  io.on('connection', socket => {
    console.log("Connected!");
    // user can now be accessed at socket.request
    const {user} = socket.request;
    console.log(user.name);
  });
};