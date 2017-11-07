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



//===========================================
//------------------Router-------------------
//===========================================

//------------------GET--------------------
router.get('/houses:id?', function(req, res, next){
  if (req.params.id){
    var id = req.params.id
    House.findById(id)
    .then(function (doc){
      doc.image = 'img/upload/house/' +  doc.image;
      res.send(doc);
      console.log(doc);
    });
    return;
  }
  House.find()
  .then(function (doc){
    for (var i = 0; i < doc.length; i++) {
      doc[i].image = 'img/upload/house/' +  doc[i].image;
    }
    res.send(doc);
    console.log(doc);
  });
  return;
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
      doc.rooms = item.rooms
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
