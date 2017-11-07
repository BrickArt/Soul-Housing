var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');

var checkAuth = require('../../middleware/checkAuth');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/upload/guest')
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, 'guest_' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
})

var upload = multer({ storage: storage });


//===========================================
//-----------------DataBase------------------
//===========================================
var House = require('../../models/house').House;
var Gist = require('../../models/gist').Gist;
var Residence = require('../../models/residence').Residence;
var Payment = require('../../models/payment').Payment;
var Test = require('../../models/test').Test;



//===========================================
//------------------Router-------------------
//===========================================

router.get('/users/user_:id?', function(req, res, next){
  var items = {
    user: {},
    residence: {},
    house: {},
    payments: [],
  };
  var id = req.params.id
  Gist.findById(id)
  .then(function (doc){

    if (doc){
      items.user = doc;
      next(items);
    } else {
      items.user = null;
      next(items);
    }
  });
}, function(items, req, res, next){
  if(items.user.residence){
    Residence.find({userID: items.user._id, endDate: null}).sort({created: -1})
    .then(function (doc){
      items.residence = doc[0];
      next(items)
    });
  }else{
    next(items)
  }

}, function(items, req, res, next){
  Payment.find()
  .then(function (doc){
    items.balance = 0;
    items.payments = doc;
    // if(doc){
    //   for (var i = 0; i < doc.length; i++) {
    //     items.balance += doc[i].sum
    //   }
    // }
    next(items)
  });
}, function(items, req, res, next){
  var id = items.residence.houseID
  House.findById(id)
  .then(function (doc){
    if (doc){
      items.house = doc;
      next(items);
    } else {
      items.house = null;
      next(items);
    }
  });
}, function(items, req, res, next){

  var user = {
    _id: items.user._id,
    name: null,
    lastname: null,
    dateOfBirth: null,
    gender: null,
    phone: null,
    program: null,
    description: null,
    status: null,
    image: null,
    residence: null,
    balance: 0,
    house: null,
    address: null,
    room: null,
    bed: null
  }
  if (items.user.name) {
    user.name = items.user.name
  }
  if (items.user.lastname) {
    user.lastname = items.user.lastname
  }
  if (items.user.dateOfBirth) {
    user.dateOfBirth = items.user.dateOfBirth
  }
  if (items.user.gender) {
    user.gender = items.user.gender
  }
  if (items.user.phone) {
    user.phone = items.user.phone
  }
  if (items.user.phone) {
    user.phone = items.user.phone
  }
  if (items.user.program) {
    user.program = items.user.program
  }
  if (items.user.description) {
    user.description = items.user.description
  }
  if (items.user.status) {
    user.status = items.user.status
  }
  if (items.user.image) {
    user.image = 'img/upload/guest/' + items.user.image
  }
  if (items.user.residence) {
    user.residence = items.user.residence
  }
  // if (items.balance) {
  //   user.balance = 120
  // }
  for (var c = 0; c < items.payments.length; c++) {
    if (req.params.id == items.payments[c].userID) {
      user.balance += items.payments[c].sum
    }
  }
  if (items.house) {
    user.house = items.house.name;
    user.address = items.house.address;
  }
  if (items.residence) {
    user.room = items.residence.room;
    user.bed = items.residence.bed;
  }

  next(user)

}, function(user, req, res, next){

  res.send(user)

});
//------------------GET--------------------
router.get('/users', function(req, res, next){
  var items = {
    users: [],
    houses: [],
    residences: [],
  };

  Gist.find().sort({name: 1})
  .then(function (doc){
    items.users = doc;
    console.log('gist ok');
    next(items)
  });


}, function(items, req, res, next){
  House.find().sort({name: 1})
  .then(function (doc){
    for (var i = 0; i < doc.length; i++) {
      var house = {
        _id: doc[i]._id,
        name: doc[i].name,
        address: doc[i].address
      }
      items.houses.push(house)
    }
    console.log('house ok');

    next(items)
  });


}, function(items, req, res, next){
  Residence.find({endDate: null})
    .then(function (doc){
      items.residences = doc;
      console.log('residence ok');

      next(items)
    });

}, function(items, req, res, next){
  Payment.find()
    .then(function (doc){
      items.payments = doc;
      console.log('payments ok');

      next(items)
    });


}, function(items, req, res, next){
  console.log('serialize');
  console.log(items.payments.length);

  var users = [];
  for (var i = 0; i < items.users.length; i++) {
    var user = {
      _id: items.users[i]._id,
      name: null,
      lastname: null,
      dateOfBirth: null,
      gender: null,
      phone: null,
      program: null,
      description: null,
      status: null,
      image: null,
      residence: null,
      balance: 0,
      house: null,
      address: null,
      room: null,
      bed: null
    }
    if (items.users[i].image) {
      user.image = 'img/upload/guest/' + items.users[i].image
    }
    if (items.users[i].description) {
      user.description = items.users[i].description
    }
    if (items.users[i].residence) {
      user.residence = items.users[i].residence
    }
    if (items.users[i].status) {
      user.status = items.users[i].status
    }
    if (items.users[i].program) {
      user.program = items.users[i].program
    }
    if (items.users[i].phone) {
      user.phone = items.users[i].phone
    }
    if (items.users[i].gender) {
      user.gender = items.users[i].gender
    }
    if (items.users[i].dateOfBirth) {
      user.dateOfBirth = items.users[i].dateOfBirth
    }
    if (items.users[i].lastname) {
      user.lastname = items.users[i].lastname
    }
    if (items.users[i].name) {
      user.name = items.users[i].name
    }
    for (var c = 0; c < items.payments.length; c++) {
      if (items.users[i]._id == items.payments[c].userID) {
        user.balance += items.payments[c].sum
      }
    }
    // users.push(user)
    if (items.users[i].residence) {
      for (var y = 0; y < items.residences.length; y++) {
        if (items.users[i].residence == items.residences[y]._id) {
          user.room = items.residences[y].room;
          user.bed = items.residences[y].bed;
          for (var e = 0; e < items.houses.length; e++) {
            if (items.houses[e]._id == items.residences[y].houseID) {
              user.house = items.houses[e].name;
              user.address = items.houses[e].address;
              users.push(user)
              break;
            }
          }
        }

      }
    } else {
      users.push(user)
    }
    if (i === items.users.length - 1) {
      next(users)
    };
  }


}, function(users, req, res, next){
res.send(users)


});




//-------------------ADD--------------------
router.post('/users/add', upload.any(), function(req, res, next){
  if(req.files[0]){
    req.body.image = req.files[0].filename;
  };
  var data = new Gist(req.body);
  var out = {
    _id: data._id,
    name: data.name,
    lastname: data.lastname,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    phone: data.phone,
    program: data.program,
    description: data.description,
    status: data.status,
    image: 'img/upload/guest/' + data.image,
    residence: data.residence,
    balance: 0,
    house: null,
    address: null,
    room: null,
    bed: null,
  };




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
router.post('/users/delete:id?', function(req, res, next){
  var id = req.body.id;
  console.log(req.body);
  Gist.findByIdAndRemove(id).exec();
  res.sendStatus(200);
});



//------------------UPDATE--------------------
router.post('/users/update:id?', upload.any(), function(req, res, next){
  var item = req.body;
  console.log(item);
  console.log(item.name);
  console.log(item.address);
  if(req.files[0]){
    item.image = req.files[0].filename;
  };
  var id = req.params.id
  Gist.findById(id, function(err, doc){
    if (err) {
      console.error('Image, no entry found');
    }
    if (item.name){
      doc.name = item.name;
    }
    if (item.lastname){
      doc.lastname = item.lastname;
    }
    if (item.phone){
      doc.phone = item.phone;
    }
    if (item.dateOfBirth){
      doc.dateOfBirth = item.dateOfBirth;
    }
    if (item.gender){
      doc.gender = item.gender;
    }
    if (item.program){
      doc.program = item.program;
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
