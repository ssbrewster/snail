jQuery(document).ready(function($) {
  $('.menu *').on('click', function(event) {
    event.preventDefault();

    if ($(event.target).hasClass('menu-results')) {
      $('.past-results').hide();
      $('.report').hide();
      $('.results').show();
    }

    if ($(event.target).hasClass('menu-past')) {
      const url = '/api/snail/results';

      $.get(url, function(response) {
        const resultsEl = $('<pre></pre>');

        $.each(response, function(index, value) {
          $(resultsEl).append(JSON.stringify(value, null, 2));
        });

        $('.past-results').html(resultsEl);
        $('.results').hide();
        $('.report').hide();
        $('.past-results').show();
      });
    }

    if ($(event.target).hasClass('menu-report')) {
      const url = '/api/snail/report';

      $.get(url, function(response) {
        $('.report > pre').html(JSON.stringify(response, null, 2));

        $('.results').hide();
        $('.past-results').hide();
        $('.report').show();
      });
    }
  });

  $('#snail-form').on('submit', function(event) {
    event.preventDefault();

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

    $.post(url, data, function(response) {
      $('.result > p').text(response);
      $('.result').show();
    });
  });
});
