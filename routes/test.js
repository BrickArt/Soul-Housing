var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
})

var upload = multer({ storage: storage })


//------------------TEST-------------------
router.get('/', function(req, res, next){
  console.log('ok');
  next();
}, function(req, res, next){
  console.log('eee');
});

router.post('/', upload.any(), function(req, res) {
  console.log(req.body, 'Body');
  console.log(req.files, 'files');
  res.end();

});


router.post('/houses', function (req, res){
  var Test = require('../models/test').Test;
  var House = require('../models/house').House;

  var item = {
    name: 'asdasdsadsd',
    address: 'ffgfgfgfgfg',
    rooms: [
      {
        num: 1,
        beds: [
          {
            num: 1
          },
          {
            num: 2
          },
        ]
      },
      {
        num: 2,
        beds: [
          {
            num: 1
          },
          {
            num: 2
          },
        ]
      }
    ]
  }
  var house = new House(item)
  house.save();
  res.end()
})
router.get('/houses', function (req, res){
  var Test = require('../models/test').Test;
  var House = require('../models/house').House;
  var id = '59e9dd02a13be75ebc325ac3'
  House.findById(id, function(err, doc){
    doc.rooms[0].beds[0].status = true;
    doc.rooms[0].beds[0].userID = '59e9da177c6f225c086cd107';

    doc.save();
    res.end()
  })


})



module.exports = router;
