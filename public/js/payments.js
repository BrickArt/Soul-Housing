function Model(data){
  var self = this;

  self.payment;

  self.users;
  self.users2;
  self.user;

  self.types


  self.searchUser = function (text) {
    var users2 = [];

    for (let i = 0; i < self.users.length; i++) {
      const user = self.users[i];
      var name = user.name + ' ' + user.lastname;
      if (~name.toLowerCase().indexOf(text.toLowerCase())) {
        users2.push(user);
      }
      if (i === self.users.length - 1) {
        return users2;
      }
    }
    
  }

  self.filterUser = function (status) {
    var users2 = [];

    for (let i = 0; i < self.users.length; i++) {
      const user = self.users[i];
      if (status) {
        if (user.status) {
          users2.push(user);
        }
      } else {
        if (!user.status) {
          users2.push(user);
        }
      }
      if (i === self.users.length - 1) {
        self.users2 = users2;
        return users2;
      }
    }
  }

  self.sortUser = function (rule) {
    var users2;
    if(self.users2){
      users2 = self.users2;
    } else {
      users2 = self.users;
    }
    console.log(rule)
    if (rule === 'name'){
      return users2.sort(function (a, b) {
        return a.name.localeCompare(b.name)
      });
      
    }
    if (rule === 'lastname'){
      console.log(users2.sort({lastname: 1}))
      return users2.sort(function (a, b) {
        return a.lastname.localeCompare(b.lastname)
      });   
    }
  }



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
    openGuest: $('.openGist'),
    usersBlock: $('.payBlock')

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

    if(+doc.sum < 0) doc.sum = -doc.sum
    
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

  self.addBthCheck = function(a) {
    console.log('222')
    if (a > 0) {
      $('.payCheck').prop('disabled', false); 
      $('.addInp').removeClass('warn');
      console.log('lf')
      
    } else {
      $('.payCheck').prop('disabled', true)
      $('.addInp').addClass('warn');
    console.log('else')
    
    }
  }

  self.init = function(users) {
    self.elements.usersBlock.html('');
    var users2 = users;
    if (users2){
      for (var i = 0; i < users2.length; i++) {
        const user = users2[i];
  
  
        if(!user.address){
          user.address = '';
        }
        if(!user.program){
          user.program = '';
        }
  
  
        var activity;
  
        if(user.status){
          activity = '<h3 class="active activeL">Active</h3>';
        } else {
          activity = '<h3 class="inactive inactiveL">Inactive</h3>';
        };
  
  
        var result =  '<div id="' + user._id + '" class="article">'+
        '<button value="' + user._id + '" class="userBtn">'+
        '<div class="gist">'+
        '<h2>' + user.name + ' ' + user.lastname + '</h2>'+
        '<p>' + user.address + '</p>'+
        '</div>'+
        '<div class="gistStatus">'+
        '<div class="Activity">'+
        '<p>' + user.program + '</p>'+
        activity +
        '</div><img src="img/svg/join.svg" alt="join" class="moreDetails"/>'+
        '</div></button></div>';
  
  
        self.elements.usersBlock.append(result);
      }


    }
  }

  self.initUsers = function(users) {
    if (users) {
      for (var i = 0; i < users.length; i++) {
        const user = users[i];
        self.usersBlock.append(model.userArticle(user))

        
      }
    }
  }


  self.type = function(){
    for (let i = 0; i < model.types.length; i++) {
      const type = model.types[i];
      var option = '<option>' + type.name + '</option>'
      $('.addType').append(option)
      console.log('a')
    }
  }



};



function Controller(model, view){
  var self = this;
  var files;

  function init(){
    var id = $('.gistPaymentsHistory').val();
    console.log(id)
    
    $.ajax({
      url: '/users/user_' + id,
      method: 'GET',
      dataType: 'json'
    }).done(function (data){
      model.user = data;
      console.log(model.user);
    });
    
    $.ajax({
      url: '/api/users',
      method: 'GET',
      dataType: 'json'
    }).done(function (data){
      model.users = data;
      console.log(model.users);
      view.init(model.users)
    });

    $.ajax({
      url: '/api/types',
      method: 'GET',
      dataType: 'json'
    }).done(function (data){
      model.types = data;
      view.type();
    });
  
  };
  init();

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

  $(document).delegate( ".addInp", "keyup", checkInp);
  $(document).delegate( ".checkInpEdit", "keyup", checkInpEdit);
  

  $(document).delegate( ".navBtn", "click", nav);


  $(document).delegate( ".searchInput", "keyup", instSearch);
  $(document).delegate( ".filterInput", "change", instFilter);
  $(document).delegate( ".sortInput", "change", instSort);

//----------------------instruments------------------------------------------
function instSearch(key) {
  console.log('search')
  var text = $('.searchInput').val()
  $('.defFilter').prop('selected', true);
  $('.defSort').prop('selected', true);
  
  
  var users = model.searchUser(text)
  view.init(users);
}


function instFilter() {
  console.log('filter')
  var text = $('.filterInput').val()
  var users;
  if (text === 'active'){
    users = model.filterUser(true)
  } else {
    if (text === 'inactive') {
      users = model.filterUser(false)
    } else {
      model.users2 = model.users
      users = model.users;
    }
  }
  // view.init(users);
  return instSort();
}


function instSort() {
  console.log('sort')
  var text = $('.sortInput').val();
  var users = model.sortUser(text)
  view.init(users)

}






  function open (){
    var id = $(this).attr('value');
    window.location.href = "/payments" + id;
    return false;
  };


  function checkInp() {
    var cash = $('.addInp').val()
    console.log('ok')
    view.addBthCheck(+cash)
  }
  function checkInpEdit() {
    var cash = $('.checkInpEdit').val()
    console.log('ok')
    view.addBthCheck(+cash)
  }

  checkInp();
  

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
      checkInpEdit();
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
    var sum = $('.editSum').val()
    if(model.payment.status === 'system'){
      sum = -sum;
    }
    data.append('sum', sum)
    data.append('date', $('.editDate').val())
    data.append('type', $('.editType').val())
    // for (var key in form){
    //   data.append(form[key].name, form[key].value)
    // }

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
