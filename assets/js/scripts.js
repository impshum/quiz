$.getJSON('assets/json/quiz.json', function(data) {
  $.each(data, function(i, item) {
    $('#content').append(`
      <div class="card question q${i}">
        <div class="card-content">
          <div class='content'>
            <h3>${item.title}</h3>
            <div class='control'>
              <label class='radio'>
                <input type='radio' name='${item.title}'>
                ${item.one}
              </label>
              <br>
              <label class='radio'>
                <input type='radio' name='${item.title}'>
                ${item.two}
              </label>
              <br>
              <label class='radio'>
                <input type='radio' name='${item.title}'>
                ${item.three}
              </label>
            </div>
          </div>
        </div>
      </div>
      `);
  });
});

function stringGen(len) {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++)
    text += charset.charAt(Math.floor(Math.random() * charset.length));
  return text;
}

function notify(msg, mode) {
  var classy = stringGen(9);
  $('body').append(`<div id='${classy}' class='notification is-${mode} slideInRight'>${msg}</div>`)
  setTimeout(function() {
    $(`#${classy}`).removeClass('slideInRight');
    $(`#${classy}`).addClass('slideOutRight');
    setTimeout(function() {
      $(`#${classy}`).remove();
    }, 3000);
  }, 3000);
}

$(document).ready(function() {

  $('#quiz').bind('submit', function(e) {
    e.preventDefault();

    $('input[type="radio"]').click(function() {
      $(`.button`).prop('disabled', false);
    });

    var all_answers = {};
    $('input[type="radio"]:checked').each(function() {
      var answer = $.trim($(this).parent().text());
      var title = $(this).attr('name');
      all_answers[title] = answer;
    });
    var all_questions = $('.question').length
    var checked_questions = $('input[type="radio"]:checked').length
    console.log(checked_questions + '/' + all_questions)
    $('#result').text(checked_questions + '/' + all_questions)
    if (checked_questions == all_questions && checked_questions != 0) {
      $.ajax({
        type: "POST",
        url: 'assets/php/check_quiz.php',
        data: {
          all_answers: all_answers
        },
        success: function(data) {
          notify("Here's your results", 'white')
          var item = JSON.parse(data);
          var percentage = item.percentage;
          var correct = item.correct;
          var total = item.total;
          var message = item.message;

          $('.question, #quiz').hide();
          $('#percent').text(`${percentage}%`);
          $('#score').text(`${correct}/${total}`);
          $('#message').text(`${message}`);
          $('.results').show();
        },
        error: function(error) {
          notify('Something went wrong', 'white')
        }
      });

    } else {
      notify('Looks like you missed something', 'white')
    }


  });

});
