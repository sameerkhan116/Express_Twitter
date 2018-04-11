document.addEventListener('DOMContentLoaded', () => {
  const follow = document.getElementById('follow');
  const unfollow = document.getElementById('unfollow');

  if (follow) {
    follow.addEventListener('click', e => {
      const user = document
        .getElementById('user_id')
        .value;
      fetch(`/follow/${user}`, {
        method: 'POST',
        credentials: 'include'
      }).then(data => {
        let btn = document.getElementById('follow');
        btn
          .classList
          .remove('btn-dark');
        btn
          .classList
          .add('btn-primary');
        btn.innerHTML = 'Following';
        btn.setAttribute('id', 'unfollow');
        return data.json();
      }).catch(err => console.log(err));
    });
  }

  if (unfollow) {
    unfollow.addEventListener('click', e => {
      const user = document
        .getElementById('user_id')
        .value;
      fetch(`/unfollow/${user}`, {
        method: 'POST',
        credentials: 'include'
      }).then(data => {
        let btn = document.getElementById('unfollow');
        btn
          .classList
          .remove('btn-primary');
        btn
          .classList
          .remove('btn-danger');
        btn
          .classList
          .add('btn-dark');
        btn.innerHTML = 'Follow';
        btn.setAttribute('id', 'follow');
        return data.json();
      }).catch(err => console.log(err));
    })

    unfollow.addEventListener('mouseenter', e => {
      unfollow
        .classList
        .remove('btn-primary');
      unfollow
        .classList
        .add('btn-danger');
      unfollow.innerHTML = 'Unfollow'
    })

    unfollow.addEventListener('mouseleave', e => {
      unfollow
        .classList
        .remove('btn-danger');
      unfollow
        .classList
        .add('btn-primary');
      unfollow.innerHTML = 'Following'
    })
  }
})