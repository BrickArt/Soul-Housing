var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');

var Jimp = require("jimp");

var checkAuth = require('../../middleware/checkAuth');

var cloudinary = require('cloudinary');
var cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'soul-housing',
  api_key: '495199143277778',
  api_secret: 'w3hydFUPpoprV-hHvrqxQDhN5ow'
})


var storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'houses',
  allowedFormats: ['jpg', 'png'],
  params:{
    angle: "exif"
  },
  filename: function (req, file, cb) {
    var fileName = 'house_' + Date.now();
    cb(undefined, fileName);
  }
});

// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/img/upload/house')
//   },
//   filename: function (req, file, cb) {
//     cb(null, 'house_' + Date.now() + '.' + file.mimetype.split('/')[1])
//   }
// })

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
router.get('/houses', function(req, res, next){
  
  House.find()
  .then(function (doc){
    var items = [];

    for (var i = 0; i < doc.length; i++) {
      
      if(doc[i].image){
        doc[i].image = doc[i].image;
      } else {
        doc[i].image = null;
      }

      var item = {
        _id: doc[i]._id,
        name: doc[i].name,
        address: doc[i].address,
        description: doc[i].description,
        rooms: doc[i].rooms,
        image: doc[i].image
      }
      items.push(item);
    }
    res.send(items);
    // console.log(doc);
  });
  return;
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
    if(!doc) return res.status(403).send('House not found')

    var house = {
      _id: doc._id,
      name: doc.name,
      address: doc.address,
      description: doc.description,
      image: doc.image,
      rooms: doc.rooms,
    }
    items.house = house;
    console.log('houses ok')
    next(items);
  }).catch(function(err){
    res.status(403).send('House not found')
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
    console.log('pays ok')
    
    next(items)
    // console.log(doc);
  });


}, function(items, req, res, next){
  Gist.find({status: true}).then(function(doc){
    var users = [];
    console.log(doc.length)
    
    if(doc.length > 0){
      
      for (var i = 0; i < doc.length; i++) {
        console.log('ok')
        // console.log('aaaa')
        var user = {
          _id: doc[i]._id,
          name: doc[i].name,
          lastname: doc[i].lastname,
          program: doc[i].program,
          balance: 0
        };
        console.log('+');
        if (items.payments.length > 0) {
          for (var n = 0; n < items.payments.length; n++) {
            if (items.payments[n].userID.toString() === doc[i]._id){
              user.balance += items.payments[n].sum;
            }
            if (n === items.payments.length - 1) {
              console.log(user)
      
              users.push(user);
            }
          }
          
        } else {
          users.push(user);
        }
        if(i === doc.length - 1){
          items.users = users;
          next(items)
        }
        // console.log(i);
      }
    } else {
      items.users = users;
    console.log('users ok')
    
      next(items)
    }
    
  }).catch(function(err){
    next(items)
  });

console.log('user ep')

}, function(items, req, res, next){
  var result = {
    _id: items.house._id,
    name: items.house.name,
    address: items.house.address,
    description: items.house.description,
    image: items.house.image,
    rooms: [],
  }
  if(items.house.rooms.length > 0) {
    
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
        // console.log('ooooooooooook');
        if(items.users.length > 0){
          for (var z = 0; z < items.users.length; z++) {
            console.log(items.house.rooms[i].beds[y].userID);
            if (items.users[z]._id.toString() === items.house.rooms[i].beds[y].userID) {
              bed.user = items.users[z]
              console.log('ioi')
            }
            if (z === items.users.length - 1) {
              room.beds.push(bed);
            }
          } 
        }else {
          room.beds.push(bed);          
        }
        if (y === items.house.rooms[i].beds.length - 1) {
          result.rooms.push(room);
        }
      }
      if (i === items.house.rooms.length - 1) {
        next(result)
      }
    }
  } else {
    next(result)
  }

}, function(result, req, res, next){
  res.send(result);
  
});



//-------------------ADD--------------------
router.post('/houses/add', upload.any(), function(req, res, next){
  console.log('post')
  console.log(req.body)
//   if(req.files[0]){
//     Jimp.read(req.files[0].destination + '/' + req.files[0].filename, function (err, image) {
//       if (err) throw err;
//       image.quality(60)
//            .exifRotate() 
//            .write(req.files[0].destination + '/' + req.files[0].filename); // save 
//       next()
//       });

//   } else {
//     next()
//   }
// }, function(req, res, next){
  var item = req.body;
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
  next(item);

}, function(item, req, res, next){

 
  if(req.files && req.files[0]){
    item.image = req.files[0].url;
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
  House.findByIdAndRemove(id).exec(function(){
    res.sendStatus(200);
  }).catch(function(err){
      res.status(403).send('House not found')
    });
});



//------------------UPDATE--------------------
router.post('/houses/update:id?', upload.any(), function(req, res, next){
  console.log('post')
  console.log(req.body)
  
//   if(req.files[0]){
//     Jimp.read(req.files[0].destination + '/' + req.files[0].filename, function (err, image) {
//       if (err) throw err;
//       image.quality(60)
//            .exifRotate() 
//            .write(req.files[0].destination + '/' + req.files[0].filename); // save 
//       next()
//       });

//   } else {
//     next()
//   }
// }, function(req, res, next){
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

  // console.log(item);
  // console.log(item.name);
  // console.log(item.address);
  if(req.files[0]){
    item.image = req.files[0].url;
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
  }).catch(function(err){
    res.status(403).send('House not found')
  });
});









module.exports = router;
