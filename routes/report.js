
var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');

var checkAuth = require('../middleware/checkAuth');

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
var House = require('../models/house').House;
var Gist = require('../models/gist').Gist;
var Residence = require('../models/residence').Residence;
var Test = require('../models/test').Test;
var Payment = require('../models/payment').Payment;
var Program = require('../models/program').Program;



//===========================================
//------------------Router-------------------
//===========================================

//------------------GET--------------------
// router.get('/houses/house_:id?', function(req, res, next){
//   var id = req.params.id;
//   House.findById(id, function(err, doc){
//     if (err) throw err;
//     next(doc);
//     return;
//   });
// }, function(house, req, res, next){
//   res.send(house)
// });

//------------------HOUSES--------------------
router.get('/report', function(req, res, next){
  var items = {
    programs: []
  };
  Program.find().then(function(doc){
    items.programs = doc;
    next(items);
  })
}, function(items, req, res, next){
  res.render('report', {programs: items.programs});
});

//-------------------data--------------------
router.get('/report/data', function(req, res, next){
  var items = {
    freeBeds: 0,
    houses: 0,
    users: 0,
    money: 0
  };

  House.find().then(function(doc){
    for (var i = 0; i < doc.length; i++) {
      for (var x = 0; x < doc[i].rooms.length; x++) {
        for (var y = 0; y < doc[i].rooms[x].beds.length; y++) {
          if (doc[i].rooms[x].beds[y].status === false) {
            ++items.freeBeds;
          }
          doc[i].rooms[x].beds[y].status
        }
      }
      if (i === doc.length - 1) {
        items.houses = doc.length
        next(items);
      }
    }
  });
}, function(items, req, res, next){
  Payment.find().then(function(doc){
    console.log(doc)
    for (var n = 0; n < doc.length; n++) {
      items.money += +doc[n].sum;
      if (n === doc.length - 1) {
        next(items);
      }
    }
  })
}, function(items, req, res, next){
  Gist.find().then(function(doc){
    items.users = doc.length;
    next(items);
  })

}, function(items, req, res, next){
  console.log(items)
  res.send(items)
});

// //-------------------Place--------------------
// router.post('/houses/place/house_:id?', function(req, res, next){
//   var id = req.params.id;
//   if (req.session.placeU){
//     console.log('llalalala');
//     var residence = new Residence();
//     var startDate = new Date;
//     startDate.setHours(0, 0, 0, 0);
//
//     residence.userID = req.session.placeU;
//     residence.houseID = req.body.houseID;
//     residence.room = req.body.room;
//     residence.bed = req.body.bed;
//     residence.price = req.body.price;
//     residence.startDate = startDate;
//     residence.save(function (err) {
//       if (err) {
//         console.log(err);
//         res.sendStatus(403);
//       }
//     });
//     console.log(req.body);
//     var houseName;
//     House.findById(id, function(err, doc){
//       if (err) {
//         console.error('Image, no entry found');
//       }
//       for (var i = 0; i < doc.rooms.length; i++) {
//         if (doc.rooms[i].num == req.body.room){
//           for (var y = 0; y < doc.rooms[i].beds.length; y++) {
//             if (doc.rooms[i].beds[y].num == req.body.bed){
//               doc.rooms[i].beds[y].status = true;
//               doc.rooms[i].beds[y].userID = req.session.placeU;
//
//               console.log(doc.rooms[i].beds[y].num);
//             }
//             console.log(doc.rooms[i].num);
//           }
//         }
//       }
//       houseName = doc.name;
//       doc.save(function (err) {
//         if (err) {
//           console.log(err);
//           res.sendStatus(403);
//         }
//       });
//     });
//     Gist.findById(req.session.placeU, function(err, doc){
//       if (err) {
//         console.error('Image, no entry found');
//       }
//       doc.status = true;
//       doc.residence = residence._id;
//       doc.houseName = houseName;
//       doc.save(function (err) {
//         if (err) {
//           console.log(err);
//           res.sendStatus(403);
//         }
//       });
//     });
//
//     req.session.placeH = null;
//     req.session.placeU = null;
//     console.log(req.session);
//     res.sendStatus(200);
//   } else {
//     next(id)
//   }
// }, function(id, req, res, next){
//   console.log(req.body);
//   req.session.placeH = req.body
//   console.log(id);
//   res.sendStatus(200);
// });









module.exports = router;
