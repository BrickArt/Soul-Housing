var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var piexif = require("piexifjs");

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



//===========================================
//------------------Router-------------------
//===========================================

//------------------GET--------------------
router.get('/houses/house_:id?', function(req, res, next){
  var id = req.params.id;
  House.findById(id, function(err, doc){
    if (err) throw err;
    next(doc);
    return;
  });
}, function(house, req, res, next){
  res.send(house)
});

//------------------HOUSES--------------------
router.get('/houses:id?', function(req, res, next){
  House.find().sort({name: 1})
    .then(function(doc){
      next(doc);
      return;
    });
}, function(doc, req, res, next){
  var id = req.params.id;
  res.render('houses', {houses: doc, houseID: id});
});

//-------------------ADD--------------------
router.post('/houses/add', function(req, res, next){
  if (req.file) {
    console.log(req.files)
  }
  next();
}, upload.any(), function(req, res, next){
  var item = req.body.rooms;
  console.log(req.body);
  var b = [];
  var r = [];
  item.forEach(function (room, i, rooms){
    b = [];
    for (var y = 0; y < room; y++) {
      b.push({
        num: y+1
      });
    };
    r.push({
      num: i+1,
      beds: b
    })
  });
  next(r);
}, function(rooms, req, res, next){
  var item = req.body;
  item.rooms = rooms;
  if(req.files[0]){
    item.image = req.files[0].filename;
  };
  next(item);
}, function(house, req, res, next){
  var data = new House(house);
  data.save(function (err) {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      res.sendStatus(200);
    }
  });
});

//-------------------Place--------------------
// router.post('/houses/place/house_:id?', function(req, res, next){
//   if (!req.session.placeH){
//     console.log('have no house');
//     console.log(req.session);
//     req.session.placeH = req.body;
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// }, function(req, res, next){
//   var items = {
//     house: {}
//   }
//   var user = req.session.placeU;
//   var house = req.body;
//   var id = req.params.id;
//   console.log(house);

//   House.findById(id, function(err, doc){
//     if (err) {
//       console.error('Image, no entry found');
//     }
//     for (var i = 0; i < doc.rooms.length; i++) {
//       if (doc.rooms[i].num == house.room){
//         for (var y = 0; y < doc.rooms[i].beds.length; y++) {
//           if (doc.rooms[i].beds[y].num == house.bed){
//             doc.rooms[i].beds[y].status = true;
//             doc.rooms[i].beds[y].userID = user;
//             console.log(doc.rooms[i].beds[y].num);
//           }
//           console.log(doc.rooms[i].num);
//         }
//       }
//       if (i === doc.rooms.length - 1) {
//         items.house.name = doc.name;
//         items.house.address = doc.address;
//         doc.save(function (err) {
//           if (err) {
//             console.log(err);
//             res.sendStatus(403);
//           } else {
//             next(items);
//           }
//         });
//       }
//     }
//   });

// }, function(items, req, res, next){
//   var id = req.params.id;
//   var user = req.session.placeU;

//   var startDate = new Date;
//   startDate.setHours(0, 0, 0, 0);


//   var residence = new Residence();
//   residence.userID = user;
//   residence.houseID = house.houseID;
//   residence.room = house.room;
//   residence.bed = house.bed;
//   residence.price = house.price;
//   residence.startDate = startDate;
//   residence.save(function (err) {
//     if (err) {
//       console.log(err);
//       res.sendStatus(403);
//     } else {
//       items.residence = residence;
//       next(items)
//     }
//   });

// }, function(items, req, res, next){
//   var id = req.params.id;
//   var house = req.session.placeH;


//   Gist.findById(id, function(err, doc){
//     if (err) {
//       console.error('Image, no entry found');
//     }
//     doc.house.name = items.house.name;
//     doc.house.address = items.house.address;
//     doc.house.room = house.room;
//     doc.house.bed = house.bed;

//     doc.status = true;
//     doc.residence = items.residence._id;
//     doc.save(function (err) {
//       if (err) {
//         console.log(err);
//         res.sendStatus(403);
//       } else {
//         req.session.placeH = null;
//         req.session.placeU = null;
//         res.sendStatus(200);
//       }
//     });
//   });
// });





// //---------------------DEL REPLACE------------------------
// router.post('/houses/delReplase', function(req, res, next){
//   console.log(req.body);
//   for (var i = 0; i < req.body.users.length; i++) {
//     var id = req.body.users[i];
//     function guestRep(callback){
//       Gist.findById(id, function (err, doc){
//         if (err) {
//           console.error('Error, no entry found');
//         }
//         console.log(doc);
//         var resid = doc._id;
//         doc.status = false;
//         doc.residence = null;
//         doc.save();
//         return callback(resid);
//       });
//     }
//     function residenceRep(id, callback){
//       console.log(id + " odddd");
//       Residence.find({userID: id}).then(function (doc){
//
//         console.log(doc);
//
//         var time = new Date();
//         time.setTime(0,0,0,0)
//
//         var h = doc.houseID;
//         var r = doc.room;
//         var b = doc.bed;
//
//         doc.endDate = time;
//
//         return callback(h, r, b);
//       });
//     }
//     function houseRep(id, r, b){
//       House.findById(id, function (err, doc){
//         if (err) {
//           console.error('Error, no entry found');
//         }
//         console.log(doc);
//         for (var y = 0; y < doc.rooms.length; y++) {
//           if (doc.rooms[y].num === r) {
//             for (var z = 0; z < doc.rooms[i].beds.length; z++) {
//               if (doc.rooms[i].beds[z].num === b) {
//                 doc.rooms[i].beds[z].status = false;
//                 doc.rooms[i].beds[z].userID = null;
//                 console.log('room clene');
//               }
//             }
//           }
//         }
//         return;
//       });
//     }
//
//     guestRep(function(){
//       console.log('gest ok');
//       residenceRep(id, function(){
//         console.log('oslolo');
//         houseRep(h, r, b);
//       });
//     });
//
//
//
//     if (i === req.body.users.length - 1) {
//       next()
//     }
//   }
//   console.log('house is keept');
// }, function(req, res, next){
//   res.sendStatus(200);
// });


//---------------------DELETE------------------------
router.post('/houses/delete/house_:id?', function(req, res, next){
  var id = req.params.id
  console.log(req.body)
  House.findById(id, function(err, doc){
    if (err) {
      console.error('Error, no entry found');
    }
    if (doc.image){
      fs.unlink('./public/img/upload/house/' + doc.image, function (err){
        if (err) throw err;
        console.log('successfully deleted - ' + doc.image);
      });
    };
  })
  House.findByIdAndRemove(id).exec();
  res.sendStatus(200);
});


//---------------------UPDATE------------------------
router.post('/houses/update:id?', upload.any(), function(req, res, next){
  var item = req.body.rooms;
  console.log(req.body);
  var b = [];
  var r = [];
  item.forEach(function (room, i, rooms){
    b = [];
    for (var y = 0; y < room; y++) {
      b.push({
        num: y+1,
        status: false
      });
    };
    r.push({
      num: i+1,
      beds: b
    })
  });
  next(r);
}, function(rooms, req, res, next){
  var item = req.body


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
      if (rooms.length >= doc.rooms.length) {
        if (rooms.length > doc.rooms.length) {
          console.log('room is empty >>>>>')
          for (var i = 0; i < rooms.length; i++) {
            if (doc.rooms[i]) {
              if (rooms[i].beds.length != doc.rooms[i].beds.length) {
                doc.rooms[i].beds = rooms[i].beds;
                console.log('---------------ok---------------------------')
              }
              // console.log('room is empty >>>>> ROOM')
              // var count = false;
              // for (var c = 0; c < doc.rooms[i].beds.length; c++) {
              //   var element = doc.rooms[i].beds[c];
              //   if (doc.rooms[i].beds[c].status) {
              //     console.log('room is empty >>>>> STATUS')
              
              //     count = true;
              //   }
              //   if (c === doc.rooms[i].beds.length - 1 && !count) {
              //     console.log('room is empty >>>>> A')
              //     console.log(doc.rooms[i])
              //     doc.rooms[i] = rooms[i]
              //     console.log(rooms[i])
                  
              //   }
              // }
              // if (rooms[i].beds.length != doc.rooms[i].beds.length) {
              //   doc.rooms[i] = rooms[i]
              // }
            } else {
              doc.rooms.push(rooms[i])
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
                doc.rooms[b] = rooms[b]
              }
              
            }
          }
        }
      } else {
        for (var y = 0; y < doc.rooms.length; y++) {
          if (rooms[y]) {
            if (rooms[y].beds.length != doc.rooms[y].beds.length) {
              doc.rooms[y] = rooms[y]
            }
          } else {
            doc.rooms.splice(y, 1);
            y--;
          }
        }
      }
    }
    if(req.files[0]){
      doc.image = req.files[0].filename;
    };
    console.log('time out')
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


//
// if(item.rooms.length < doc.rooms.length){
//   for (var i = 0; i < doc.rooms.length; i++){
//     if(item.rooms[i]){
//       if (item.rooms[i] === doc.rooms[i].beds.length) {
//         console.log('its a analog room');
//       } else {
//         doc.rooms[i] = rooms[i]
//       }
//     }else{
//       doc.rooms.splice(i, 1)
//       i--
//     }
//   }
// } else{
//   for (var i = 0; i < item.rooms.length; i++) {
//     console.log('room is -------------' + i);
//
//     if(item.rooms.length === doc.rooms.length){
//       if (item.rooms[i] === doc.rooms[i].beds.length) {
//       } else {
//         doc.rooms[i] = rooms[i]
//       }
//     }
//     if(item.rooms.length > doc.rooms.length){
//       if(doc.rooms[i]){
//         if (item.rooms[i] === doc.rooms[i].beds.length) {
//         } else {
//           doc.rooms[i] = rooms[i]
//         }
//       }else{
//         doc.rooms.push(rooms[i])
//       }
//     }
//   }
//
// }






//------------------FreeBeds-------------------
router.get('/freeBeds:id?', function (req, res, next){
  House.find().sort({name: 1}).then(function(doc){
    next(doc);
  })
}, function (houses, req, res, next){
  var id = req.params.id
  res.render('freeBeds', {houses, houseID: id})
});






module.exports = router;
