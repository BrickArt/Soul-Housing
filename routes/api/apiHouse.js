var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');

var checkAuth = require('../../middleware/checkAuth');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/upload/house')
  },
  filename: function (req, file, cb) {
    cb(null, 'house_' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
})

var upload = multer({ storage: storage });


//===========================================
//-----------------DataBase------------------
//===========================================
var House = require('../../models/house').House;
var Gist = require('../../models/gist').Gist;
var Residence = require('../../models/residence').Residence;
var Test = require('../../models/test').Test;
var Payment = require('../../models/payment').Payment;




//===========================================
//------------------Router-------------------
//===========================================

//------------------GET--------------------
// router.get('/houses:id?', function(req, res, next){
//   if (req.params.id){
//     var id = req.params.id
//     House.findById(id)
//     .then(function (doc){
//       doc.image = 'img/upload/house/' +  doc.image;
//       res.send(doc);
//       console.log(doc);
//     });
//     return;
//   }
//   House.find()
//   .then(function (doc){
//     for (var i = 0; i < doc.length; i++) {
//       doc[i].image = 'img/upload/house/' +  doc[i].image;
//     }
//     res.send(doc);
//     console.log(doc);
//   });
//   return;
// });

router.get('/houses', function(req, res, next){
  var items = {
    houses: [],
    users: [],
    payments: []
  };
  House.find().sort({name: 1}).then(function(doc){
    var houses = [];
    for (var i = 0; i < doc.length; i++) {
      var house = {
        _id: doc[i]._id,
        name: doc[i].name,
        address: doc[i].address,
        description: doc[i].description,
        image: 'img/upload/house/' +  doc[i].image,
        rooms: doc[i].rooms,
      }
      houses.push(house)
    }
    items.houses = houses;
    next(items)
    console.log(doc);
  });


}, function(items, req, res, next){
  Payment.find().then(function(doc){
    var payments = [];
    for (var i = 0; i < doc.length; i++) {
      var payment = {
        _id: doc[i]._id,
        userID: doc[i].userID,
        sum: doc[i].sum
      };
      payments.push(payment);
    }
    items.payments = payments;
    next(items)
    console.log(doc);
  });



}, function(items, req, res, next){
  Gist.find({status: true}).then(function(doc){
    var users = [];
    for (var i = 0; i < doc.length; i++) {
      var user = {
        _id: doc[i]._id,
        name: doc[i].name,
        lastname: doc[i].lastname,
        program: doc[i].program,
        balance: doc[i].balance
      };
      // for (var n = 0; n < items.payments.length; n++) {
      //   console.log('+');
      //   if (items.payments[n].userID == doc[i]._id){
      //     user.balance += items.payments[n].sum;
      //   }
      //   if (n === items.payments.length - 1) {
      //   }
      // }
      users.push(user);
    }
    items.users = users;
    next(items)
    console.log(doc);
  });


}, function(items, req, res, next){
  var results = [];
  for (var u = 0; u < items.houses.length; u++) {
    var result = {
      _id: items.houses[u]._id,
      name: items.houses[u].name,
      address: items.houses[u].address,
      description: items.houses[u].description,
      image: items.houses[u].image,
      rooms: [],
    };

    for (var i = 0; i < items.houses[u].rooms.length; i++) {
      var room = {
        num: items.houses[u].rooms[i].num,
        beds: []
      }
      for (var y = 0; y < items.houses[u].rooms[i].beds.length; y++) {
        var bed = {
          num: items.houses[u].rooms[i].beds[y].num,
          status: items.houses[u].rooms[i].beds[y].status,
          user: {}
        }
        for (var z = 0; z < items.users.length; z++) {
          if (items.users[z]._id == items.houses[u].rooms[i].beds[y].userID) {
            bed.user = items.users[z]
          }
          if (z === items.users.length - 1) {
            room.beds.push(bed);
          }
        }
        if (y === items.houses[u].rooms[i].beds.length - 1) {
          result.rooms.push(room);
        }
      }
      if (i === items.houses[u].rooms.length - 1) {
        results.push(result);
      }
    }
    if (u === items.houses.length - 1) {
      next(results)
    }
  }


}, function(results, req, res, next){
  res.send(results)
});
router.get('/houses:id?', function(req, res, next){
  var id = req.params.id;
  var items = {
    house: [],
    users: [],
    payments: [],
  };
  House.findById(id)
  .then(function(doc){

    var house = {
      _id: doc._id,
      name: doc.name,
      address: doc.address,
      description: doc.description,
      image: 'img/upload/house/' +  doc.image,
      rooms: doc.rooms,
    }
    items.house = house;

    next(items);
  });


}, function(items, req, res, next){
  Payment.find().then(function(doc){
    var payments = [];
    for (var i = 0; i < doc.length; i++) {
      var payment = {
        _id: doc[i]._id,
        userID: doc[i].userID,
        sum: doc[i].sum
      };
      payments.push(payment);
    }
    items.payments = payments;
    next(items)
    console.log(doc);
  });


}, function(items, req, res, next){
  Gist.find({status: true}).then(function(doc){
    var users = [];
    for (var i = 0; i < doc.length; i++) {
      var user = {
        _id: doc[i]._id,
        name: doc[i].name,
        lastname: doc[i].lastname,
        program: doc[i].program,
        balance: 0
      };
      for (var n = 0; n < items.payments.length; n++) {
        console.log('+');
        if (items.payments[n].userID == doc[i]._id){
          user.balance += items.payments[n].sum;
        }
        if (n === items.payments.length - 1) {
          users.push(user);
        }
      }
    }
    items.users = users;
    next(items)
    console.log(doc);
  });



}, function(items, req, res, next){
  var result = {
    _id: items.house._id,
    name: items.house.name,
    address: items.house.address,
    description: items.house.description,
    image: items.house.image,
    rooms: [],
  }

  for (var i = 0; i < items.house.rooms.length; i++) {
    var room = {
      num: items.house.rooms[i].num,
      beds: []
    }
    for (var y = 0; y < items.house.rooms[i].beds.length; y++) {
      var bed = {
        num: items.house.rooms[i].beds[y].num,
        status: items.house.rooms[i].beds[y].status,
        user: {}
      }
      console.log('ooooooooooook');
      for (var z = 0; z < items.users.length; z++) {
        console.log(items.house.rooms[i].beds[y].userID);
        if (items.users[z]._id == items.house.rooms[i].beds[y].userID) {
          bed.user = items.users[z]
        }
        if (z === items.users.length - 1) {
          room.beds.push(bed);
        }
      }
      if (y === items.house.rooms[i].beds.length - 1) {
        result.rooms.push(room);
      }
    }
    if (i === items.house.rooms.length - 1) {
      next(result)
    }
  }

}, function(result, req, res, next){
  res.send(result);
  
});



//-------------------ADD--------------------
router.post('/houses/add', upload.any(), function(req, res, next){
  var item = req.body;
  console.log(req.body);
  if (req.body.rooms) {
    var rooms = req.body.rooms;
    var n = [];
    var a = [];

    rooms.forEach(function (room, i, rooms){
      a = [];
      for(y = 0; y < room; y++){
        a.push({
          num: y + 1,
          status: false
        })
      }
      n.push({
        num: i + 1,
        beds: a
      });
    });
    item.rooms = n;
  }

  console.log(item);
  console.log(item.name);
  console.log(item.address);
  if(req.files[0]){
    item.image = req.files[0].filename;
  };

  var data = new House(item);

  data.save(function (err) {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      res.send(data);
    }
  });
});



//-------------------DELETE--------------------
router.post('/houses/delete:id?', function(req, res, next){
  var id = req.params.id
  console.log(req.body)
  House.findByIdAndRemove(id).exec();
  res.sendStatus(200);
});



//------------------UPDATE--------------------
router.post('/houses/update:id?', upload.any(), function(req, res, next){
  var item = req.body;
  console.log(req.body);
  if (req.body.rooms) {
    var rooms = req.body.rooms;
    var n = [];
    var a = [];

    rooms.forEach(function (room, i, rooms){
      a = [];
      for(y = 0; y < room; y++){
        a.push({
          num: y + 1,
          status: false
        })
      }
      n.push({
        num: i + 1,
        beds: a
      });
    });
    item.rooms = n;
  }

  console.log(item);
  console.log(item.name);
  console.log(item.address);
  if(req.files[0]){
    item.image = req.files[0].filename;
  };
  var id = req.params.id
  House.findById(id, function(err, doc){
    if (err) {
      console.error('Image, no entry found');
    }
    if (item.name){
      doc.name = item.name;
    }
    if(item.address){
      doc.address = item.address;
    }
    if (item.description) {
      doc.description = item.description;
    }
    if (item.image){
      doc.image = item.image;
    }
    if (item.rooms){
      if (item.rooms.length >= doc.rooms.length) {
        if (item.rooms.length > doc.rooms.length) {
          for (var i = 0; i < item.rooms.length; i++) {
            if (doc.rooms[i]) {
              if (item.rooms[i].beds.length != doc.rooms[i].beds.length) {
                doc.rooms[i].beds = item.rooms[i].beds
              }
            } else {
              doc.rooms.push(item.rooms[i])
            }
          }
        } else {
          for (var b = 0; b < doc.rooms.length; b++) {
            var element = doc.rooms[b];
            var count = false;
            for (var v = 0; v < element.beds.length; v++) {
              var element2 = element.beds[v];
              if (element2.status) {
                count = true;
              }
              if (v === element.beds.length - 1 && !count) {
                doc.rooms[b] = item.rooms[b]
              }
              
            }
          }
        }
      } else {
        for (var y = 0; y < doc.rooms.length; y++) {
          if (item.rooms[y]) {
            if (item.rooms[y].beds.length != doc.rooms[y].beds.length) {
              doc.rooms[y].beds = item.rooms[y].beds
            }
          } else {
            doc.rooms.splice(y, 1);
            y--;
          }
        }
      }
    }

    doc.save(function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        res.sendStatus(200);
      }
    });
  });
});









module.exports = router;
