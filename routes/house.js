var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var piexif = require("piexifjs");
var Jimp = require("jimp");

var log = require('../lib/log')(module);


var checkAuth = require('../middleware/checkAuth');
var rotate = require('../middleware/photoRotate');

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
//     console.log(file)
    
//     cb(null, './public/img/upload/house')
//   },
//   filename: function (req, file, cb) {
//     var fileName = 'house_' + Date.now() + '.' + file.mimetype.split('/')[1];
//     cb(null, fileName);
    
//   }
  
// })

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
  if(id){
    House.findById(id, function(err, doc){
      if (err) throw err;
      next(doc);
      return;
    });
  } else {
    res.status(403).send('House id, not found!')
  }
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
router.post('/houses/add', upload.any(), function(req, res, next){
//   console.log(req.files[0])
//   if(req.files[0]){
//     Jimp.read(req.files[0].url, function (err, image) {
//       if (err) throw err;
//       image.quality(60)
//            .exifRotate() 
//            .write(req.files[0].url); // save 
//       next()
//       });

//   } else {
//     next()
//   }
// }, function(req, res, next){
  var item = req.body.rooms;
  // console.log(req.body);
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
    item.image = req.files[0].url;
  };
  next(item);
}, function(house, req, res, next){
  var data = new House(house);
  data.save(function (err) {
    if (err) {
      console.log(err);
      log.error(err)
      res.sendStatus(403);
    } else {
      log.info('House is added #' + data._id.toString())
      res.sendStatus(200);
    }
  });
});



//---------------------DELETE------------------------
router.post('/houses/delete/house_:id?', function(req, res, next){
  var id = req.params.id
  // House.findById(id, function(err, doc){
  //   if (err) {
  //     console.error('Error, no entry found');
  //   }
  //   if (doc.image){
  //     fs.unlink('./public/img/upload/house/' + doc.image, function (err){
  //       if (err) throw err;
  //       console.log('successfully deleted - ' + doc.image);
  //     });
  //   };
  // })
  House.findByIdAndRemove(id).exec(function(doc) {
    log.info('House is deleted #' + doc._id.toString())
    return res.sendStatus(200);
  });
});


//---------------------UPDATE------------------------
router.post('/houses/update:id?', upload.any(), function(req, res, next){
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
  console.log(req.files[0])
  // var item = req.body.rooms;
  // var b = [];
  // var r = [];
  // item.forEach(function (room, i, rooms){
  //   b = [];
  //   for (var y = 0; y < room; y++) {
  //     b.push({
  //       num: y+1,
  //       status: false
  //     });
  //   };
  //   r.push({
  //     num: i+1,
  //     beds: b
  //   })
  // });
  // next(r);
  next();
}, function(req, res, next){
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
    // if (item.rooms){
    //   if (rooms.length >= doc.rooms.length) {
    //     if (rooms.length > doc.rooms.length) {
    //       // console.log('room is empty >>>>>')
    //       for (var i = 0; i < rooms.length; i++) {
    //         if (doc.rooms[i]) {
    //           if (rooms[i].beds.length != doc.rooms[i].beds.length) {
    //             doc.rooms[i].beds = rooms[i].beds;
    //             // console.log('---------------ok---------------------------')
    //           }
    //           // console.log('room is empty >>>>> ROOM')
    //           // var count = false;
    //           // for (var c = 0; c < doc.rooms[i].beds.length; c++) {
    //           //   var element = doc.rooms[i].beds[c];
    //           //   if (doc.rooms[i].beds[c].status) {
    //           //     console.log('room is empty >>>>> STATUS')
              
    //           //     count = true;
    //           //   }
    //           //   if (c === doc.rooms[i].beds.length - 1 && !count) {
    //           //     console.log('room is empty >>>>> A')
    //           //     console.log(doc.rooms[i])
    //           //     doc.rooms[i] = rooms[i]
    //           //     console.log(rooms[i])
                  
    //           //   }
    //           // }
    //           // if (rooms[i].beds.length != doc.rooms[i].beds.length) {
    //           //   doc.rooms[i] = rooms[i]
    //           // }
    //         } else {
    //           doc.rooms.push(rooms[i])
    //         }
    //       }
    //     } else {
    //       for (var b = 0; b < doc.rooms.length; b++) {
    //         var element = doc.rooms[b];
    //         var count = false;
    //         for (var v = 0; v < element.beds.length; v++) {
    //           var element2 = element.beds[v];
    //           if (element2.status) {
    //             count = true;
    //           }
    //           if (v === element.beds.length - 1 && !count) {
    //             doc.rooms[b] = rooms[b]
    //           }
              
    //         }
    //       }
    //     }
    //   } else {
    //     for (var y = 0; y < doc.rooms.length; y++) {
    //       if (rooms[y]) {
    //         if (rooms[y].beds.length != doc.rooms[y].beds.length) {
    //           doc.rooms[y] = rooms[y]
    //         }
    //       } else {
    //         doc.rooms.splice(y, 1);
    //         y--;
    //       }
    //     }
    //   }
    // }

//------ new code!

    if(item.rooms){
      doc.rooms = JSON.parse(req.body.rooms);
    }

    if(req.files[0]){
      doc.image = req.files[0].url;
    };
    // console.log('295 - houses.js - ', doc)
    // console.log(req.body)
    // console.log(req.body.rooms)
    // console.log(JSON.parse(req.body.rooms))


    doc.save(function (err) {
      if (err) {
        // console.log(err);
        log.error(err)
        res.sendStatus(403);
      } else {
        log.info('House is updated #' + doc._id.toString())
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
