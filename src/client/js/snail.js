jQuery(document).ready(function($) {
  $('#login-form').on('submit', function(event) {
    event.preventDefault();

    const url = '/api/login';
    const data = {
      username: $(this)
        .find('#username')
        .val(),
      password: $(this)
        .find('#password')
        .val(),
      grant_type: 'password',
      client_id: 'null',
      client_secret: 'null'
    };

    $.post(url, data, function(response) {
      localStorage.setItem('snailToken', 'Bearer ' + response.access_token);

      $.ajax({
        url: '/results.html',
        type: 'GET',
        headers: { Authorization: 'Bearer ' + response.access_token },
        success: function(html) {
          document.location.hash = 'snail';
          $('.wrap').html(html);

          $('.menu *').on('click', function(event) {
            event.preventDefault();

            if ($(event.target).hasClass('menu-results')) {
              $('.past-results').hide();
              $('.report').hide();
              $('.results').show();
            }

            if ($(event.target).hasClass('menu-past')) {
              const url = '/api/snail/results';
              const access_token = localStorage.getItem('snailToken');

              $.ajax({
                url: url,
                type: 'GET',
                headers: { Authorization: access_token },
                success: function(response) {
                  const resultsEl = $('<pre></pre>');

                  $.each(response, function(index, value) {
                    $(resultsEl).append(JSON.stringify(value, null, 2));
                  });

                  $('.past-results').html(resultsEl);
                  $('.results').hide();
                  $('.report').hide();
                  $('.past-results').show();
                }
              });
            }

            if ($(event.target).hasClass('menu-report')) {
              const url = '/api/snail/report';
              const access_token = localStorage.getItem('snailToken');

              $.ajax({
                url: url,
                type: 'GET',
                headers: { Authorization: access_token },
                success: function(response) {
                  $('.report > pre').html(JSON.stringify(response, null, 2));

                  $('.results').hide();
                  $('.past-results').hide();
                  $('.report').show();
                }
              });
            }
          });

          $('#snail-form').on('submit', function(event) {
            event.preventDefault();

            const access_token = localStorage.getItem('snailToken');
            const url = '/api/snail';
            const data = {
              h: $(this)
                .find('#height')
                .val(),
              u: $(this)
                .find('#up')
                .val(),
              d: $(this)
                .find('#down')
                .val(),
              f: $(this)
                .find('#fatigue')
                .val()
            };

            $.ajax({
              url: url,
              type: 'POST',
              data: data,
              headers: { Authorization: access_token },
              success: function(response) {
                $('.result > p').text(response);
                $('.result').show();
              }
            });
          });
        }
      });
    });
  });
});
