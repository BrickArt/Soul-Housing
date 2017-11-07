$(function(){
  $(document).delegate('form', 'submit', login);

  function login (){
    var form = $(this);
    $('.error', form).html('');

    $.ajax({
      method: "POST",
      url: "/login",
      data: form.serialize(),
      statusCode: {
        200: function() {
          form.html("Вы вошли в сайт").addClass('alert-success');
          window.location.href = "/houses";
        },
        403: function(jqXHR) {
          var error = JSON.parse(jqXHR.responseText);
          $('.error', form).html(error.message);
        }
      }
    }).done(function (data){

    });
    return false;
  };


});
