function Model(data){
  var self = this;



};



function View(model){
  var self = this;

  self.elements = {
    left: $('.payBlock'),
    right: $('.right'),
    addBtn: $('.addBtn'),

  };


//==========Show-Hide==========

//----------Plus button----------
    self.addBtnShow = function (){
      var button = self.elements.addBtn;
      button.show();
    };

    self.addBtnHide = function (){
      var button = self.elements.addBtn;
      button.hide();
    };

//----------Right----------
    self.rightShow = function (){
      var right = self.elements.right;
      right.show();
    };

    self.rightHide = function (){
      var right = self.elements.right;
      right.hide();
    };


//==========Functions==========

  self.init = function (data) {
    self.elements.left.html(data);
    console.log('view');
  };

  self.initate = function (data) {
    self.elements.right.html(data);
    console.log('view');
  };


  self.open = function (data){
    var right = self.elements.right;
    right.html(data);
  };

  self.del = function (id) {
    $('#' + id).slideUp();
    return self.data;
  };

  self.add = function (data){
    var right = self.elements.right;
    right.html(data);
  };



};



function Controller(model, view){
  var self = this;
  var files;

  $(document).delegate( ".gistPaymentsHistory", "click", add);
  $(document).delegate( ".add", "submit", save);

  $(document).delegate( ".userBtn", "click", open);
  $(document).delegate( ".addCancel", "click", cancel);
  $(document).delegate( ".gistShelterHistory", "click", info);

  $(document).delegate('input[type=file]', 'change', function(){
    files = this.files;
    console.log(this.files)

  });

  $(document).delegate( ".navBtn", "click", nav);

  function open (){
    var id = $(this).attr('value');
    window.location.href = "/payments" + id;
    return false;
  };


  function nav(){
    var a = $(this).attr('value');
    console.log('function');
    sessvars.house = null;
    sessvars.user = null;
    window.location.href = a
  };
//---------------ADD-------------------
  function add() {
    $('.openGist').hide();
    $('.add').show();
  };

//---------------CANCEL-------------------
  function cancel() {
    $('.add').hide();
    $('.openGist').show();
  };

//---------------SAVE-------------------
  function save () {
    event.stopPropagation(); // Остановка происходящего
    event.preventDefault();  // Полная остановка происходящего
    var id = $('.addSave').val();
    var formEvent = $(this);
    // Создадим данные формы и добавим в них данные файлов из files
    var form = $('.add').serializeArray();

    var data = new FormData();

    for (var key in form){
      data.append(form[key].name, form[key].value)
    }

    console.log(form)
    console.log(data)
    if (files){
      $.each( files, function( key, value ){
        data.append( key, value );
      });
    }

    $.ajax({
        url: '/payments/add' + id,
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false, // Не обрабатываем файлы (Don't process the files)
        contentType: false, // Так jQuery скажет серверу что это строковой запрос
        statusCode: {
          200: function() {
            formEvent.html("Payment is saved").addClass('alert-success');
            window.location.href = '/payments' + id;
          },
          403: function(jqXHR) {
            var error = JSON.parse(jqXHR.responseText);
            $('.error', formEvent).html(error.message);
          }
        },
        error: function( jqXHR, textStatus, errorThrown ){
            console.log('ОШИБКИ AJAX запроса: ' + textStatus );
        }
    });
  };




  function info () {
    var id = $(this).attr('value');
    window.location.href = "/users"+id;
    return false;
  };



};



$(function(){
  var model = new Model();
  var view = new View(model);
  var controller = new Controller(model, view);
});
