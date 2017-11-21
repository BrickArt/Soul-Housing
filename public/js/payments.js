function Model(data){
  var self = this;

  self.payment;



};



function View(model){
  var self = this;

  self.elements = {
    left: $('.payBlock'),
    right: $('.right'),
    addBtn: $('.addBtn'),

    date: $('.editDate'),
    sum: $('.editSum'),
    type: $('.editType'),
    image: $('.editImage'),
    save: $('.editSave'),

    doneBtn: $('.done'),
    delBtn: $('.delete'),

    edit: $('.edit'),
    openGuest: $('.openGist')

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

  self.edit = function(doc) {
    var date = new Date(doc.date);
    var d = date.getDate();
    var m = date.getMonth() + 1;
    var y = date.getFullYear();
    if(d<10) d = '0'+ d;
    if(m<10) m = '0'+ m;
    var result = m + '/' + d + '/' + y;
    
    self.elements.date.val(result);
    self.elements.sum.val(doc.sum);
    self.elements.type.val(doc.type);
    self.elements.save.val(doc._id);
    self.elements.delBtn.val(doc._id);
    
    if(doc.status === 'pending') {
      
      self.elements.doneBtn.prop('disabled', false);
      self.elements.doneBtn.val(doc._id);
      self.elements.doneBtn.css('display', 'inherit');
      
    } else {
      self.elements.doneBtn.css('display', 'none');
    }

    self.elements.openGuest.hide();
    self.elements.edit.show();
  }

  self.done = function(data) {
    self.elements.doneBtn.prop('disabled', true);
    self.elements.doneBtn.val('');
  };




};



function Controller(model, view){
  var self = this;
  var files;

  $(document).delegate( ".gistPaymentsHistory", "click", add);
  $(document).delegate( ".add", "submit", save);
  
  $(document).delegate( ".payment", "click", onEdit);
  $(document).delegate( ".editSave", "click", update);
  $(document).delegate( ".done", "click", done);

  $(document).delegate( ".delete", "click", del);

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
    $.session.remove('houseID');
    $.session.remove('userID');
    $.session.remove('room');
    $.session.remove('bed');
    $.session.remove('price');
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
    view.elements.edit.hide();
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

  function onEdit() {
    var id = $(this).val();
    $.ajax({
      url: '/payments/payment_' + id,
      type: 'GET'
    }).done(function(data){
      console.log(data)
      model.payment = data;
      view.edit(data)
    })
  }

  function update() {
    event.stopPropagation(); // Остановка происходящего
    event.preventDefault();  // Полная остановка происходящего
    var id = $('.editSave').val()
    var formEvent = $(this);
    // Создадим данные формы и добавим в них данные файлов из files
    var form = $('.edit').serializeArray();

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
      url: '/payments/edit/payment_' + id,
      type: 'post',
      data: data,
      cache: false,
      dataType: 'json',
      processData: false, // Не обрабатываем файлы (Don't process the files)
      contentType: false, // Так jQuery скажет серверу что это строковой запрос
      statusCode: {
        200: function() {
          formEvent.html("Payment is saved").addClass('alert-success');
          window.location.href = '/payments' + model.payment.userID;
        },
        403: function(jqXHR) {
          var error = JSON.parse(jqXHR.responseText);
          $('.error', formEvent).html(error.message);
        }
      },
      error: function( jqXHR, textStatus, errorThrown ){
          console.log('ОШИБКИ AJAX запроса: ' + textStatus );
      }
    }).done(function(data){
      console.log(data)
    })
  }

  function done() {
    $('body').css('cursor', 'wait')
    var id = $('.editSave').val();
    var now = new Date;
    var item = {
      date: now,
      status: 'done'
    }
    $.ajax({
      url: '/payments/edit/payment_' + id,
      type: 'post',
      data: item
    }).done(function(data){
      $('body').css('cursor', 'default')
      console.log(data)
      view.done(data)
      window.location.href = '/payments' + data.userID;
    })
  }

  function del() {
    var id = model.payment._id;
    var user = model.payment.userID;

    $.ajax({
      url: '/payments/delete/payment_' + id,
      type: 'post'
    }).done(function(data){
      $('body').css('cursor', 'default')
      console.log(data)
      window.location.href = '/payments' + user;
    })
  }



};



$(function(){
  var model = new Model();
  var view = new View(model);
  var controller = new Controller(model, view);
});
