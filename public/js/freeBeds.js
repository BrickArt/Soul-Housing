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
        self.elements.rooms.append('<div class="addText addRoom" id="room_undefined"><div class="addRoomLeft"><p class="room">Room #</p><p class="roomNum">' + model.rooms[i].num + '</p></div><div class="addRoomRight"><button class="bedsLeft" value="' + i + '" type="button"><img src="img/png/left.png" alt="left"/></button><input id="room_' + i + '" class="beds" value="' + model.rooms[i].beds + '" type="number" max="50" min="1" name="rooms[' + i + ']"/><button value="' + i + '" type="button" class="bedsRight"><img src="img/png/right.png" alt="right"/></button><p>Beds</p><button class="roomDel" value="' + i + '"><img src="img/png/del.png" alt="Del"/></button>')
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




  $(document).delegate( ".houseAddPerson", "click", place);

  $(document).delegate( ".selectRoom", "change", selectRoom);
  $(document).delegate( ".selectBed", "change", selectBed);
  $(document).delegate( ".selectPrice", "keypress", selectPrice);



  $(document).delegate( ".navBtn", "click", nav);




//===========================================
//---------------Functions-------------------
//===========================================
  function init(){
    var id = $('.houseAddPerson').val();
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

  function open(){
    var id = $(this).attr('value');

    window.location.href = '/freeBeds' + id;
  };




//---------------PLACE-------------------
  function place () {
    sessvars.house = {
      houseID: model.house._id,
      room: $('.selectRoom').val(),
      bed: $('.selectBed').val(),
      price: $('.selectPrice').val(),
    }

    if (sessvars.user) {
      //place
      $.ajax({
        url: '/api/residence/place',
        method: 'POST',
        data: {
          userID: sessvars.user.userID,
          houseID: sessvars.house.houseID,
          room: sessvars.house.room,
          bed: sessvars.house.bed,
          price: sessvars.house.price
        },
        statusCode: {
          200: function() {
            console.log('ok' );
            var user = sessvars.user
            sessvars.house = null;
            sessvars.user = null;
            window.location.href = '/users'+ user.userID;
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
        $('.selectBed').append('<option value="' + (1 + j) + '">Bed ' + (1 + j) + '</option>')
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
    var num = $(this).val();
    var data = $('#room_' + num).val()
    if(data<50){
      $('#room_' + num).val(+data + 1)
    }
    return;
  }
  function bedDown (){
    var num = $(this).val();
    var data = $('#room_' + num).val()
    if(data>0){
      $('#room_' + num).val(+data - 1)
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
