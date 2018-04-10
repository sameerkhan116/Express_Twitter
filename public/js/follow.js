$(function () {
  $(document)
    .on('click', '#follow', function (e) {
      e.preventDefault();
      var user_id = $('#user_id').val();
      $.ajax({
        type: 'POST',
        url: "/follow/" + user_id,
        success: function (data) {
          $('#follow')
            .removeClass('btn-dark')
            .addClass('btn-primary')
            .html('Following')
            .attr('id', 'unfollow')
        },
        error: function (data) {
          console.log(data);
        }
      })
    });
});