// connect the socket $(function () {   let socket = io();
// $('#sendTweet').submit(function () {     let content = $('#tweet').val();
// socket.emit('tweet', {content});     $('#tweet').val('');     return false;
// }); });

document.addEventListener('DOMContentLoaded', () => {
  let socket = io();
  document
    .getElementById('sendTweet')
    .addEventListener('submit', e => {
      e.preventDefault();
      let content = document
        .getElementById('tweet')
        .value;
      socket.emit('tweet', {content});
      document
        .getElementById('tweet')
        .value = '';
    })
});