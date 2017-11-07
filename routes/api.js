var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');

var House = require('../models/house').House;

var checkAuth = require('../middleware/checkAuth');

var storageHouse = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/upload/house')
  },
  filename: function (req, file, cb) {
    cb(null, 'house_' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
})

var house = multer({ storage: storageHouse });

var storageUser = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/upload/guest')
  },
  filename: function (req, file, cb) {
    cb(null, 'guest_' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
})

var user = multer({ storage: storageUser });

var storagePayment = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/upload/payment')
  },
  filename: function (req, file, cb) {
    cb(null, 'payment_' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
})

var payment = multer({ storage: storagePayment });

// router.get('/houses:id?', require('./api/api_houses').get);
// // router.post('/houses/add', house.fields([]), require('./api/api_houses').add);
//
//
// router.post('/houses/add', house.any(), function(req, res, next){
//   var item = req.body;
//   console.log(req.body);
//   if (req.body.rooms) {
//     var rooms = req.body.rooms;
//     var n = [];
//     var a = [];
//
//     rooms.forEach(function (room, i, rooms){
//       a = [];
//       for(y = 0; y < room; y++){
//         a.push({
//           num: y + 1,
//           status: false
//         })
//       }
//       n.push({
//         num: i + 1,
//         beds: a
//       });
//     });
//     item.rooms = n;
//
//   }
//
//   console.log(item);
//   console.log(item.name);
//   console.log(item.address);
//   if(req.files[0]){
//     item.image = req.files[0].filename;
//   };
//
//   var data = new House(item);
//
//   data.save(function (err) {
//     if (err) {
//       console.log(err);
//       res.sendStatus(403);
//     } else {
//       res.sendStatus(200);
//     }
//   });
// })

//
// router.post('/houses/delete', require('./api/api_houses').delete);
// router.post('/houses/update', require('./api/api_houses').update);
//
//
//
// router.get('/users:id?', require('./api/api_users').get);
// router.post('/users/add', user.single(), require('./api/api_users').add);
// router.post('/users/delete', require('./api/api_users').delete);
// router.post('/users/update', require('./api/api_users').update);
//
//
// //router.get('/payments', require('./api/api_payments').get);
// //router.post('/payments/add:id?', payment.single(), require('./api/api_payments').add);
//
//
// router.get('/residence/user:id?', require('./api/api_residence').user);
// router.get('/residence/house:id?', require('./api/api_residence').house);
// router.get('/residence', require('./api/api_residence').get);
// router.post('/residence', require('./api/api_residence').add);
//
//
// router.get('/program', require('./api/api_program').get);
// router.post('/program', require('./api/api_program').program);

module.exports = router;
