/*
  Not using jQuery anymore, run these functions when DOM content is loaded.
  set socket as io which we pass in server.js.
  First we get data from the sendTweet form and emit it using socket.
  We then "emit" this data on socket so it is available for everyone.
*/
document.addEventListener('DOMContentLoaded', () => {
  let socket = io();
  let send = document.getElementById('sendTweet');
  if (send) {
    send.addEventListener('submit', e => {
      e.preventDefault();
      let content = document
        .getElementById('tweet')
        .value;
      socket.emit('tweet', {content});
      document
        .getElementById('tweet')
        .value = '';
    });
  }

  // In io.js, we emit the data back to be rendered on the front end. For this we
  // need to create a new child element and prepend to the parent element.
  socket.on('incomingTweets', ({user, content}) => {
    // console.log({content, user});
    const parentNode = document.getElementById('tweets');
    const newChild = document.createElement('div');
    newChild.className = "media";
    const refChild = parentNode.firstElementChild;

    let html = '';
    html += `<a class="pr-3" href="/user/${user._id}">`;
    html += `<img src=${user.photo} alt=${user.name} class="media-object"></a>`;
    html += `<div class="media-body"><h4 class="mt-0">${user.name}</h4>`;
    html += `<p>${content}</p></div>`;

    newChild.innerHTML = html;
    parentNode.insertBefore(newChild, refChild);
  });
});