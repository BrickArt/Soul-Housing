function Model(data){
  var self = this;

  self.house;
  self.rooms = [];
  self.placeData;
  self.placeHouse;

  self.roomDel = function(i){
    self.rooms[i] = null;
    console.log(self.rooms);
  };

  self.roomAdd = function(){
    if(self.rooms.length){

      for (var i = 0; i < self.rooms.length; i++) {
        if(self.rooms[i] === null){
          var r = {
            num: i + 1,
            beds: 1
          };
          self.rooms[i] = r;
          console.log(self.rooms);
          return self.rooms
        }
      }

    }
    var r = {
      num: self.rooms.length + 1,
      beds: 1
    };
    self.rooms.push(r);
    console.log(self.rooms);
    return self.rooms
  }

  self.roomSave = function (id, beds){
    self.rooms[id].beds = beds;
    return self.rooms;
  };

  self.editInit = function(){
    var rooms = self.house.rooms;
    var counts = [];
    for (var i = 0; i < rooms.length; i++) {
      var r = {
        num: i + 1,
        beds: rooms[i].beds.length
      };

      counts.push(r)
      if (i === rooms.length - 1) {
        self.rooms = counts
        console.log(counts);
      }
    }
  }


  self.find = function (array, value) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].id == value) return i;
    }
    return -1;
  };

  self.del = function (item) {
    self.data.splice(item, 1);
    return self.data;
  }

  self.add = function (item) {
    self.data.push(item);
    return self.data;
  };

  self.editSave = function (i, item){
    self.data[i] = item;
    return self.data;
  };

  self.placeData;
  self.placeHouse;

  self.editRooms = function (){
    var num = self.rooms[self.rooms.length - 1].num;
    var result = []

    for (var i = 0; i < num; i++) {
      if (true) {

      }
      result.push(self.rooms[i].beds.length)
    }
  }


};



function View(model){
  var self = this;

  self.elements = {
    addBtn: $('.addBtn'),
    left: $('.houseBlock'),
    right: $('.right'),
    cancelBtn: $('.addCancel'),
    openBtn: $('.openBtn'),
    delBtn: $('.gistDel'),
    rooms: $('.rooms'),
    openHouse: $('.openHouse'),
    delBtn: $('.gistDel'),
    editBtn: $('.gistEdit'),
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

  self.delete = function (id){
    $('#' + id).slideUp();
  };

  self.add = function (data){
    var right = self.elements.right;
    right.html(data);
  };

  self.roomAdd = function (data){
    var rooms = $('.rooms');
    rooms.append(data);
  };

  self.roomDel = function (id){
    $('#room_' + id).slideUp();
    $('#room_' + id).addClass('null')
    $('#room_' + id + ' input').attr('value', null);
  };

  self.save = function(data){
    var house = self.elements.houseBlock;
    house.append(data);
  };

  self.edit = function (data) {
    var right = self.elements.right;
    right.html(data);
  }

  self.initRooms = function(){
    self.elements.rooms.html('');
    for (var i = 0; i < model.rooms.length; i++) {
      if(model.rooms[i] === null){

      } else {
        var flag = "";
        var ahtung = '';
        if (model.house.rooms[i]) {
          for (var y = 0; y < model.house.rooms[i].beds.length; y++) {
            if (model.house.rooms[i].beds[y].status){
              flag = 'disabled';
              ahtung = 'delEditFalse';
            }
          }
        }
        self.elements.rooms.append('<div class="addText addRoom" id="room_undefined"><div class="addRoomLeft"><p class="room">Room #</p><p class="roomNum">' + model.rooms[i].num + '</p></div><div class="addRoomRight"><button class="bedsLeft" value="' + i + '" type="button"><img src="img/png/left.png" alt="left"/></button><input id="room_' + i + '" class="beds" value="' + model.rooms[i].beds + '" type="number" max="50" min="1" name="rooms[' + i + ']"/><button value="' + i + '" type="button" class="bedsRight"><img src="img/png/right.png" alt="right"/></button><p>Beds</p><button class="roomDel ' + ahtung + '"' + flag + ' value="' + i + '"><img src="img/png/del.png" alt="Del"/></button>')
      }

    }

  }


  self.btnUnlock = function(){
    self.elements.delBtn.removeAttr('disabled');
    self.elements.editBtn.removeAttr('disabled');
  }




};




function Controller(model, view){
  var self = this;
  var files;
  var updateInput;
  var placeHouse;

//===========================================
//-----------------Events--------------------
//===========================================
  $(document).delegate( ".houseBtn", "click", open);

  $(document).delegate( ".addBtn", "click", add);
  $(document).delegate( ".addSave", "click", save);
  $(document).delegate( ".addCancel", "click", cancel);
  $(document).delegate( ".gistDel", "click", del);

  $(document).delegate( ".roomAdd", "click", roomAdd);
  $(document).delegate( ".beds", "change", saveBeds);
  $(document).delegate( ".roomDel", "click", roomDel);

  $(document).delegate( ".gistEdit", "click", edit);
  $(document).delegate( ".editCancel", "click", editCancel);
  $(document).delegate( ".editSave", "click", update);
  $(document).delegate( ".delEditFalse", "click", delEditFalse);

  $(document).delegate('input[type=file]', 'change', function(){
    files = this.files;
    console.log(this.files)
  });

  $(document).delegate( ".placeOpen", "click", placeOpen);
  $(document).delegate( ".houseAddPerson", "click", place);

  $(document).delegate( ".selectRoom", "change", selectRoom);
  $(document).delegate( ".selectBed", "change", selectBed);
  $(document).delegate( ".selectPrice", "keypress", selectPrice);

  $(document).delegate( ".cancel", "click", cancelPlace);
  $(document).delegate( ".placeHouse", "click", placeHouse);
  $(document).delegate( ".placeUserBtn", "click", openPlace);

  $(document).delegate( ".bedsLeft", "click", bedDown);
  $(document).delegate( ".bedsRight", "click", bedUp);

  $(document).delegate( ".navBtn", "click", nav);

  $(document).delegate( ".houseGistList", "click", guestsList);



//===========================================
//---------------Functions-------------------
//===========================================
  function init(){
    var id = $('.gistEdit').val();
    if (id) {
      $.ajax({
        url: '/houses/house_' + id,
        method: 'GET',
        dataType: 'json'
      }).done(function (data){
        model.house = data;
        view.btnUnlock();
        console.log(model.house);
      });
    }else{
      return;
    }

  };
  init();

  function nav(){
    var a = $(this).attr('value');
    console.log('function');
    sessvars.house = null;
    sessvars.user = null;
    window.location.href = a
  };
//------------------ADD----------------------
  function add() {
    $('.openHouse').hide();
    $('.add').show();
    model.rooms = []
  };

//---------------SAVE-------------------
  function save(){
    event.stopPropagation(); // Остановка происходящего
    event.preventDefault();  // Полная остановка происходящего
    var formEvent = $('.add');
    // Создадим данные формы и добавим в них данные файлов из files
    var form = $('.add').serializeArray();

    var data = new FormData();

    for (var key in form){
      data.append(form[key].name, form[key].value)
    }

    console.log(form)
    console.log(data)

    $.each( files, function( key, value ){
        data.append( key, value );
    });

    $.ajax({
        url: '/houses/add',
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false, // Не обрабатываем файлы (Don't process the files)
        contentType: false, // Так jQuery скажет серверу что это строковой запрос
        statusCode: {
          200: function() {
            formEvent.html("House is saved").addClass('alert-success');
            window.location.href = "/houses";
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

//---------------CANCEL-------------------
  function cancel() {
    $('.add').hide();
    $('.openHouse').show();
  };

//-----------------OPEN------------------
  function open (){
    var id = $(this).attr('value');
    window.location.href = "/houses" + id;
    return false;
  };

//---------------DELETE-------------------
  function del(){
    var id = $('.gistDel').attr('value');
    var count = 0;
    var guests = []
    if (model.house.rooms.length) {
      console.log('rooms length ');
      for (var i = 0; i < model.house.rooms.length; i++) {
        console.log('room' + i);
        if (model.house.rooms[i].beds.length) {
          for (var y = 0; y < model.house.rooms[i].beds.length; y++) {
            console.log('bed' + y);
            if (model.house.rooms[i].beds[y].status == true) {
              guests.push(model.house.rooms[i].beds[y].userID);
              ++count;
              console.log('1 person');
            }
          }
        }
        if (i === model.house.rooms.length - 1) {
          if (count > 0) {
            var u = confirm("Are you sure, because there are " + count + " guests in this house?");
            if (u) {
              delReplace(guests);
            }
          } else {
            var u = confirm("Are you sure?");
            if (u) {
              delHouse();
            }
          }
        }
      }
    }

    function delReplace (u){
      $.ajax({
        method: "POST",
        url: "/houses/delReplase",
        data: {
          users: u
        },
        statusCode: {
          200: function() {
            delHouse()
          },
          403: function(jqXHR) {
            var error = JSON.parse(jqXHR.responseText);
            $('.error', form).html(error.message);
          }
        }
      });
    }

    function delHouse (id){
      var right = view.elements.openHouse;
      console.log('id is del--- ' + id)
      var d = $('.gistDel').attr('value')
      $.ajax({
        method: "POST",
        url: "/houses/delete" + d,
        statusCode: {
          200: function() {
            right.html("House is deleted").addClass('alert-success');
            view.delete(id);
          },
          403: function(jqXHR) {
            var error = JSON.parse(jqXHR.responseText);
            $('.error', form).html(error.message);
          }
        }
      });
    }

  };



  function delEditFalse(){
    alert('Plece, replace all users in this room!')
  }
//---------------EDIT-------------------
  function edit() {
    $('.openHouse').hide();
    $('.edit').show();
    model.editInit();
    view.initRooms()

  };

  // function edit () {
  //   var id = $(this).attr('value');
  //   $.ajax({
  //     method: "POST",
  //     url: "/houses/edit",
  //     data: {
  //       id: id
  //     }
  //   }).done(function (data){
  //     view.add(data);
  //     view.addBtnHide();
  //     view.rightShow();
  //   });
  //   return false;
  // };

//-------------EDIT-CANCEL-----------------
  function editCancel() {
    $('.edit').hide();
    $('.openHouse').show();
  };

//---------------PLACE-------------------
  function placeOpen() {
    $('.place').show();
    $(this).hide();
    // var id = $(this).val();
    // var house;
    // $.ajax({
    //   url: '/houses/house_' + id,
    //   method: 'POST',
    //   dataType: 'json'
    // }).done(function (data){
    //   placeHouse = data;
    // });
  };



  function openPlace () {
    var id = $(this).val();
    var right = $('.right');
    console.log('change person');
    $.ajax({
        url: '/houses/place/open' + id,
        type: 'POST',
        dataType: 'json',
    }).done(function(data){
      console.log('done');
      $('.openGist').html(data);
    });
  };


  function placeHouse () {
    sessvars.house = {
      name: 'ololo'
    }
    console.log(sessvars.house);
    var right = $('.right');
    var id = $(this).val();
    var data = {
      userID: id,
      houseID: model.placeData.houseID,
      room: model.placeData.room,
      bed: model.placeData.bed,
      price: model.placeData.price,
    };
    console.log(data)
    // $.ajax({
    //     url: '/houses/place/save',
    //     type: 'POST',
    //     data: data,
    //     cache: false,
    //     dataType: 'json',
    //     statusCode: {
    //       200: function() {
    //         right.html("User placed in house").addClass('alert-success');
    //         window.location.href = "/houses";
    //       },
    //       403: function(jqXHR) {
    //         var error = JSON.parse(jqXHR.responseText);
    //         $('.error', formEvent).html(error.message);
    //       }
    //     },
    //     error: function( jqXHR, textStatus, errorThrown ){
    //         console.log('ОШИБКИ AJAX запроса: ' + textStatus );
    //     }
    // });
  };

  function cancelPlace () {
    window.location.href = '/houses' + model.placeData.houseID;
  };







//---------------ADD-ROOM-------------------
  function roomAdd (){
    model.roomAdd();
    view.initRooms();

  };
//---------------DEL-ROOM-------------------
  function roomDel (){
    var num = $(this).attr('value');
    view.roomDel(num);
    model.roomDel(num);
    view.initRooms();
    return false;
  };

//---------------saveBeds-------------------
  function saveBeds (){
    var beds = $(this).val();
    var name = $(this).attr('name');
    var id = name.slice(6, -1);
    console.log(beds);
    console.log(name, 'name');
    console.log(id, 'id');
    model.roomSave(id, beds);
    // view.roomDel(num);
    // model.roomDel(num);
    // view.initRooms();
    return false;
  };



//---------------UPDATE-------------------
  function update(){
    event.stopPropagation(); // Остановка происходящего
    event.preventDefault();  // Полная остановка происходящего
    var formEvent = $('.edit');
    // Создадим данные формы и добавим в них данные файлов из files
    var form = $('.edit').serializeArray();
    var id = $('.editSave').val();

    var data = new FormData();

    // var name = $('.houseNameEdit').val();
    // data.append( 'name', name );
    //
    // var address = $('.houseAddressEdit').val();
    // data.append( 'address', address );
    //
    // var description = $('.houseNotesEdit').val();
    // data.append( 'description', description );

    for (var key in form){
      data.append(form[key].name, form[key].value)
    }
    console.log('ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo');
    console.log(data, "rooms")


    $.each( files, function( key, value ){
        data.append( key, value );
    });
    console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    console.log(data.name)



    $.ajax({
        url: '/houses/update' + id,
        type: 'POST',
        data: data,
        cache: false,
        dataType: 'json',
        processData: false, // Не обрабатываем файлы (Don't process the files)
        contentType: false, // Так jQuery скажет серверу что это строковой запрос
        statusCode: {
          200: function() {
            formEvent.html("House is saved").addClass('alert-success');
            window.location.href = "/houses";
            console.log('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb');
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


//---------------PLACE-------------------
  function place () {

    var house = {
      houseID: model.house._id,
      room: $('.selectRoom').val(),
      bed: $('.selectBed').val(),
      price: $('.selectPrice').val(),
    }

    $.session.set('houseID', house.houseID);
    $.session.set('room', house.room);
    $.session.set('bed', house.bed);
    $.session.set('price', house.price);

    var user = $.session.get('userID');
    console.log();
    if (user) {
      //place
      $.ajax({
        url: '/api/residence/place',
        method: 'POST',
        data: {
          userID: user,
          houseID: house.houseID,
          room: house.room,
          bed: house.bed,
          price: house.price
        },
        statusCode: {
          200: function() {
            console.log('ok' );
            var user =   $.session.get('userID')
            $.session.remove('houseID');
            $.session.remove('userID');
            $.session.remove('room');
            $.session.remove('bed');
            $.session.remove('price');
            // sessvars.house = null;
            // sessvars.user = null;
            window.location.href = '/users'+ user;
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
    } else {
      window.location.href = '/users';
    }



  };


  var control = [false, false, false];
  function selectRoom (){
    control[0] = true;
    console.log('room');
    console.log(control);
    var num = $('.selectRoom').val();
    console.log(num);
    if (control[0] && control[1] && control[2]){
      $('.houseAddPerson').attr('style', 'background-color: #8DBC5E; border: none; cursor: pointer; color: white');
      $('.houseAddPerson').removeAttr('disabled')
    }
    $('.selectBed').html('<option selected disabled>Bed</option>')
    for (var j = 0; j < model.house.rooms[num - 1].beds.length; j++) {
      if (model.house.rooms[num - 1].beds[j].length === 0){
        j++
      }
      if (!model.house.rooms[num - 1].beds[j].status) {
        $('.selectBed').append('<option>' + (1 + j) + '</option>')
      }
    }
  };

  function selectBed (){
    control[1] = true;
    console.log('bed');
    console.log(control);
    if (control[0] && control[1] && control[2]){
      $('.houseAddPerson').attr('style', 'background-color: #8DBC5E; border: none; cursor: pointer; color: white');
      $('.houseAddPerson').removeAttr('disabled');
    }
  };

  function selectPrice (){
    control[2] = true;
    console.log('prise');
    console.log(control);
    if (control[0] && control[1] && control[2]){
      $('.houseAddPerson').attr('style', 'background-color: #8DBC5E; border: none; cursor: pointer; color: white');
      $('.houseAddPerson').removeAttr('disabled')
    }
  };
//===========================================
//---------------Functions-------------------
//===========================================

  function bedUp (){
    console.log('click');
    var num = $(this).val();
    var data = $('#room_' + num).val()
    var val = +data + 1
    if(data<50){
      model.roomSave(num, val)
      view.initRooms();
    }
    return;
  }
  function bedDown (){
    var num = $(this).val();
    var data = $('#room_' + num).val()
    var val = +data - 1
    if(data>0){
      model.roomSave(num, val)
      view.initRooms();
    }
    return;
  }


function guestsList (){
  var id = $(this).attr('value');
  window.location.href = '/api/doc/houses/house_' + id;
}






};



$(function(){
  var model = new Model();
  var view = new View(model);
  var controller = new Controller(model, view);
});
