function Model(data){
  var self = this;

  self.house = {};
  self.rooms = [];
  self.placeData;
  self.placeHouse;
  self.houseWith;
  self.placer = {};

  self.sortRoomsByNum = function(arr) {
    arr.sort(function(a, b) {
      if (a.num > b.num) return 1;
      if (a.num < b.num) return -1;
      return 0;
    })
  }

  self.roomDel = function(num){
    for (var i = 0; i < self.rooms.length; i++) {
      var room = self.rooms[i];
      if (room && +room.num === +num) return self.rooms[i] = null
    }
    
    // self.rooms[i] = null;
    // console.log(self.rooms);
  };

  self.roomAdd = function(){
    if(self.rooms.length){

      for (var i = 0; i < self.rooms.length; i++) {
        if(self.rooms[i] === null){
          var r = {
            num: i + 1,
            beds: [{num: 1, userID: null, status: false}]
          };
          self.rooms[i] = r;
          console.log(self.rooms);
          
          return self.rooms
        }
      }

    }
    var r = {
      num: self.rooms.length + 1,
      beds: [{num: 1, userID: null, status: false}]
    };
    self.rooms.push(r);
    console.log(self.rooms);
    return self.rooms
  }

  self.roomSave = function (num, beds){
    for (var i = 0; i < self.rooms.length; i++) {
      var room = self.rooms[i];
      if (room && +room.num === +num) {
        var bedsD = [];
        for (var n = 1; n < beds; n++) {
          bedsD.push({num: n, userID: null, status: false})
        }
        return self.rooms[i].beds = bedsD
      }
    }
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

  self.addInit = function (){
    self.rooms = [];
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
    for (var i = 0; i < model.house.rooms.length; i++) {
      if(model.house.rooms[i] !== null){

        var flag = "";
        var ahtung = '';
        if (model.house.rooms[i]) {
          for (var y = 0; y < model.house.rooms[i].beds.length; y++) {
            if (model.house.rooms[i].beds[y].status){
              // flag = 'disabled';
              // ahtung = 'delEditFalse';
            }
          }
        }
        self.elements.rooms.append('<div class="addText addRoom ' + ahtung + '"><div class="addRoomLeft "><p class="room">Room #</p><p class="roomNum">' + model.house.rooms[i].num + '</p></div><div class="addRoomRight"><button ' + flag + ' class="editBedKeyDown" value="' + model.house.rooms[i].num + '" type="button"><img src="img/png/left.png" alt="left"/></button><input id="room_' + model.house.rooms[i].num + '" class="editBedInput" value="' + model.house.rooms[i].beds.length + '" type="number" max="50" min="1" name="rooms[' + i + ']"/><button value="' + model.house.rooms[i].num + '" type="button" ' + flag + ' class=" editBedKeyUp"><img src="img/png/right.png" alt="right"/></button><p>Beds</p><button type="button" class="editBedKeyDelete ' + ahtung + '"' + flag + ' value="' + model.house.rooms[i].num + '"><img src="img/png/del.png" alt="Del"/></button></div></div>')
      }

    }

  }

  self.initRoomsOnAdd = function(){
    self.elements.rooms.html('');
    for (var i = 0; i < model.rooms.length; i++) {
      if(model.rooms[i] !== null){

        var flag = "";
        var ahtung = '';
        if (model.rooms[i] && model.rooms[i].beds) {
          for (var y = 0; y < model.rooms[i].beds.length; y++) {
            if (model.rooms[i].beds[y].status){
              // flag = 'disabled';
              // ahtung = 'delEditFalse';
            }
          }
        }
        self.elements.rooms.append('<div class="addText addRoom ' + ahtung + '"><div class="addRoomLeft "><p class="room">Room #</p><p class="roomNum">' + model.rooms[i].num + '</p></div><div class="addRoomRight"><button ' + flag + ' class="bedsLeft" value="' + model.rooms[i].num + '" type="button"><img src="img/png/left.png" alt="left"/></button><input id="room_' + model.rooms[i].num + '" class="beds" value="' + model.rooms[i].beds.length + '" type="number" max="50" min="1" name="rooms[' + i + ']"/><button value="' + model.rooms[i].num + '" type="button" ' + flag + ' class="bedsRight"><img src="img/png/right.png" alt="right"/></button><p>Beds</p><button type="button" class="roomDel ' + ahtung + '"' + flag + ' value="' + model.rooms[i].num + '"><img src="img/png/del.png" alt="Del"/></button></div></div>')
      }

    }

  }


  self.btnUnlock = function(){
    self.elements.delBtn.removeAttr('disabled');
    self.elements.editBtn.removeAttr('disabled');
  }


  self.initHouse = function(){
    var rooms = model.houseWith.rooms;
    console.log(model.houseWith)
    
    
    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      var bedsAticles = '';
      for (let y = 0; y < room.beds.length; y++) {
        const bed = room.beds[y];
        if (bed.user) {
          var guest = ''
          if(!bed.user.program || bed.user.program === 'Select Program'){
            bed.user.program = ''
          }
          if (bed.status) {
            guest = '<button class="guestOpen" value="' + bed.user._id + '">' + bed.user.name + ' ' + bed.user.lastname + '</button><p>' + bed.user.program + '</p><p class="balance">' + bed.user.balance + ' $</p>'
          } else {
            guest = '<p>EMPTY</p><button class="overPlace" value="' + room.num + '/' + bed.num + '">PLACE</button>'
          }
          var room12 = '<div class="viewBed"><p>'+ bed.num +'</p>' + guest + '</div>'
          bedsAticles += room12

        }
        
      }
      var roomArticle = '<div class="viewRoom"><h2>Room '+ room.num +'</h2>' + bedsAticles + '</div>'
      $('.overviewRooms').append(roomArticle)
      
    }
  }


  self.openPlacer = function() {

    $('.popInfo > p').text(model.house.name);
    $('.popInfo > h1').text('Room: ' + model.placer.room);
    $('.popInfo > h2').text('Bed: ' + model.placer.bed);
    $('.placerInput').val('');
    $('.superPuperHousePlace').show();
  }


  self.closePlacer = function (){
    $('.superPuperHousePlace').hide();
  }

  self.placerBtn = function(r) {
    if (r) {
      $('.placerBtn').prop('disabled', false);
    } else {
      $('.placerBtn').prop('disabled', true);      
    }
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

  $(document).delegate( "#addBtn", "click", add);
  $(document).delegate( ".addSave", "click", save);
  $(document).delegate( ".addCancel", "click", cancel);
  $(document).delegate( ".gistDel", "click", del);

  $(document).delegate( ".roomAdd", "click", roomAdd);
  $(document).delegate( ".beds", "change", AddBedInput);
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

  $(document).delegate( ".guestOpen", "click", guestOpen);
  $(document).delegate( ".overPlace", "click", superPlace);
  

  $(document).delegate( ".notificationHouse", "click", closePlacer);
  $(document).delegate( ".closeNotif", "click", closePlacer);
  
  $(document).delegate( ".placerInput", "keyup", placerChange);
  $(document).delegate( ".placerBtn", "click", placerPlace);


  $(document).delegate(".editBedKeyUp", "click", editBedKeyUp);
  $(document).delegate(".editBedKeyDown", "click", editBedKeyDown);
  $(document).delegate(".editBedInput", "change", editBedInput);
  $(document).delegate(".editBedKeyDelete", "click", editBedKeyDelete);
  $(document).delegate(".editBedKeyAdd", "click", editBedKeyAdd);
  $(document).delegate( ".roomAddOnEdit", "click", AddBedInput);
  
  
  
//===========================================
//---------------Functions-------------------
//===========================================

function bedUp (){
  var up = $(this).val();

  model.rooms.forEach(function(room) {
    if (room && +room.num === +up) {
      var roomNum;
        for(i = 1; i <= 50; i++){
          var flag = true;
          for(y = 0; y < room.beds.length; y++){
            if (+room.beds[y].num === +i) {
              flag = false;
            }
          }
          if(flag) {
            roomNum = i;
            break
          }
        }
      room.beds.push({
        num: roomNum,
        userID: null,
        status: false
      })
    }
  });
  
  view.initRoomsOnAdd();
}
function bedDown (){
  var down = $(this).val();

    model.rooms.forEach(function (room) {
      if (room && +room.num === +down) {
        for (var i = room.beds.length - 1; i >= 0; i--) {
          var bed = room.beds[i];

          if (!bed.status) {
            room.beds.splice(i, 1);
            break
          }

          // console.log(i)
          
        }
      }
    });

    view.initRoomsOnAdd();
}

function AddBedInput() {
  var bedsCurrent = $(this).val();
  var id = $(this).attr('id').slice(5);

  model.rooms.forEach(function(room) {
    if (room && +room.num === +id) {
      // console.log('abc')
      
      if (bedsCurrent > room.beds.length) {
        for(var i = 0; i < bedsCurrent; i++) {
          // console.log('abc')
          
          if (!room.beds[i]){
            room.beds[i] = {
              num: i + 1,
              userID: null,
              status: false
            }
          }

        }
        
      } else {
        for (var i = room.beds.length - 1; i >= bedsCurrent; i--) {
          // console.log('abc')

          if (!room.beds[i].status) {
            room.beds.splice(i, 1);
          }

        }
        // console.log('Rooms - ' + room.beds.length)
        return          
      }
    }
  })

  view.initRoomsOnAdd();
  // console.log(id)
};

  function editBedKeyUp() {
    var up = $(this).val();

    model.house.rooms.forEach(function(room) {
      if (room && +room.num === +up) {
        var roomNum;
        for(i = 1; i <= 50; i++){
          var flag = true;
          for(y = 0; y < room.beds.length; y++){
            if (+room.beds[y].num === +i) {
              flag = false;
            }
          }
          if(flag) {
            roomNum = i;
            break
          }
        }
        room.beds.push({
          num: roomNum,
          userID: null,
          status: false
        })
      }
    });
    
    view.initRooms();

    // console.log(up)
    // console.log(model.house.rooms[0])
  };
  function editBedKeyDown() {
    var down = $(this).val();

    model.house.rooms.forEach(function (room) {
      if (room && +room.num === +down) {
        for (var i = room.beds.length - 1; i >= 0; i--) {
          var bed = room.beds[i];

          if (!bed.status) {
            room.beds.splice(i, 1);
            break
          }

          // console.log(i)
          
        }
      }
    });

    view.initRooms();
    // console.log('wahaha')
  };
  
  function editBedInput() {
    var bedsCurrent = $(this).val();
    var id = $(this).attr('id').slice(5);

    model.house.rooms.forEach(function(room) {
      if (room && +room.num === +id) {
        // console.log('abc')
        
        if (bedsCurrent > room.beds.length) {
          for(var i = 0; i < bedsCurrent; i++) {
            // console.log('abc')
            
            if (!room.beds[i]){
              room.beds[i] = {
                num: i + 1,
                userID: null,
                status: false
              }
            }

          }
          
        } else {
          for (var i = room.beds.length - 1; i >= bedsCurrent; i--) {
            // console.log('abc')

            if (!room.beds[i].status) {
              room.beds.splice(i, 1);
            }

          }
          // console.log('Rooms - ' + room.beds.length)
          return          
        }
      }
    })
  
    view.initRooms();
    // console.log(id)
  };
  function editBedKeyDelete() {
    var id = $(this).val();

    model.house.rooms.forEach(function(room, r) {
      if (room && +room.num === +id) {
        console.log(room)
        var flag = true;
        room.beds.forEach(function(bed) {
          if (bed.status) flag = false;
        });
        // if (flag) model.house.rooms.splice(r, 1)
        if (flag) model.house.rooms[r] = null
      }
    });
    view.initRooms();
    console.log(model.house.rooms)
    
    console.log('wahaha')
  };
  function editBedKeyAdd() {
    console.log(model.house.rooms)
    var flag = true;
    model.house.rooms.forEach(function(room, r) {
      if(!room && flag){
        flag = false;
        model.house.rooms[r] = {
          num: r + 1,
          beds: [
            {
              num: 1,
              userID: null,
              status: false
            }
          ]
        }
        return view.initRooms();
        
      }

    })
    if (flag) {
      var roomNum;
        for(i = 1; i <= 50; i++){
          var flag = true;
          for(y = 0; y < model.house.rooms.length; y++){
            if (+model.house.rooms[y].num === +i) {
              flag = false;
            }
          }
          if(flag) {
            roomNum = i;
            break
          }
        }
      model.house.rooms.push({
        num: roomNum,
        beds: [
          {
            num: 1,
            userID: null,
            status: false
          }
        ]
      })}
      
    model.sortRoomsByNum(model.house.rooms)
    view.initRooms();
    console.log('wahha')
  };




  function init(){
    var id = $('.gistEdit').val();
    console.log('init')
    
    if (id) {
      $.ajax({
        url: 'api/houses' + id,
        method: 'GET',
        dataType: 'json'
      }).done(function (data){
        model.houseWith = data;
        view.initHouse();
        console.log(model.house);
      });
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
    $.session.remove('houseID');
    $.session.remove('userID');
    $.session.remove('room');
    $.session.remove('bed');
    $.session.remove('price');
    window.location.href = a
  };
//------------------ADD----------------------
  function add() {
    $('.openHouse').hide();
    $('.add').show();
    model.rooms = [];
    model.house.rooms= [];
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
            alert("Please replace users before deleting occupied beds, because there are " + count + " guests in this house!");

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
        url: "/houses/delete/house_" + d,
        statusCode: {
          200: function() {
            right.html("House is deleted").addClass('alert-success');
            view.delete(d);
            window.location.href = "/houses"
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
    alert('Please replace users before deleting occupied beds!')
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

function roomAddOnEdit() {
  model.roomAdd();
  view.initRooms();
}





//---------------ADD-ROOM-------------------
  function roomAdd (){
    model.roomAdd();
    view.initRoomsOnAdd();

  };
//---------------DEL-ROOM-------------------
  function roomDel (){
    var num = $(this).attr('value');
    // view.roomDel(num);
    model.roomDel(num);
    view.initRoomsOnAdd();
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

    var name = $('.houseNameEdit').val();
    data.append( 'name', name );
    
    var address = $('.houseAddressEdit').val();
    data.append( 'address', address );
    
    var description = $('.houseNotesEdit').val();
    data.append( 'description', description );

    var rooms = model.house.rooms;
    for (var i = 0; i < rooms.length; i++) {
      var room = rooms[i];
      if (!room) {
        rooms.splice(i, 1)
        i--
      }
    }
    
    model.sortRoomsByNum(rooms);
    rooms.forEach(function(room) {
      model.sortRoomsByNum(room.beds)
    })
    // var roomItems = [];
    // rooms.forEach(function(room) {
    //   var b = []
    //   room.beds.forEach(function(bed){
    //     b.push({
    //       num: bed.num,
    //       status: bed.status,
    //       userID: bed.userID
    //     })
    //   })
    //   roomItems.push({
    //     num: room.num,
    //     beds: b
    //   })
    // });

    data.append('rooms', JSON.stringify(rooms) );

    // console.log(roomItems)

    // var formGroup = {
    //   name: $('.houseNameEdit').val(),
    //   address: $('.houseAddressEdit').val(),
    //   description: $('.houseNotesEdit').val(),
    //   rooms: model.house.rooms
    // }

    // for (var key in formGroup) {
    //   // data.append(form[key].name, form[key].value)
    //   console.log(key)
    //   console.log(formGroup.key)
    // }

    // for (var key in form){
    //   data.append(form[key].name, form[key].value)
    // }


    $.each( files, function( key, value ){
        data.append( key, value );
    });



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
            window.location.href = "/houses" + id;
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

  


function guestsList (){
  var id = $(this).attr('value');
  window.location.href = '/api/doc/houses/house_' + id;
}


function guestOpen() {
  var id = $(this).attr('value');
  window.location.href = '/users' + id;
}

function superPlace(){
  var data = $(this).attr('value');
  var aaa = data.split('/');
  var room = aaa[0];
  var bed = aaa[1];
  console.log(room, data)
  model.placer.room = room 
  model.placer.bed = bed 
  view.openPlacer()


  // window.location.href = '/users';
}



//-----------------------placer-----------------
function closePlacer() {
  view.closePlacer();
}

function placerChange() {
  var price = $(this).val();
  if (price) {
    view.placerBtn(true)
  } else {
    view.placerBtn(false)
  }
}

function placerPlace() {
  var house = model.house._id;
  var room = model.placer.room;
  var bed = model.placer.bed;
  var price = $('.placerInput').val();


  var house = {
    houseID: house,
    room: room,
    bed: bed,
    price: price,
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


}



};



$(function(){
  var model = new Model();
  var view = new View(model);
  var controller = new Controller(model, view);
});
