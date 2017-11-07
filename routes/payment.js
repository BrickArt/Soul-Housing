var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');

var checkAuth = require('../middleware/checkAuth');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/upload/payments')
  },
  filename: function (req, file, cb) {
    cb(null, 'payment_' + Date.now() + '.' + file.mimetype.split('/')[1])
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
var Program = require('../models/program').Program;
var Payment = require('../models/payment').Payment;



//===========================================
//------------------Router-------------------
//===========================================

//------------------GET--------------------
// router.get('/users/user_:id', function(req, res, next){
//   var id = req.params.id;
//   Gist.findById(id, function(err, doc){
//     if (err) throw err;
//     next(doc);
//     return;
//   });
// }, function(guest, req, res, next){
//   res.send(guest)
// });

//------------------USERS--------------------
router.get('/payments:id?', function(req, res, next){
  Gist.find().sort({name: 1})
    .then(function(doc){
      console.log(doc);
      var items = {
        users: doc
      };
      next(items);
      return;
    });
}, function(items, req, res, next){
  var id;
  if (req.params.id){
    id = req.params.id;
  }else{
    id = items.users[0]._id
  }
  Payment.find({userID: id}).sort({date: -1})
    .then(function(doc){
        items.payments = doc;
        console.log(doc);
      next(items);
      return;
    });
}, function(items, req, res, next){
  console.log(items);
  res.render('payments', {guests: items.users, payments: items.payments, guestID: req.params.id})
});

//-------------------ADD--------------------
router.post('/payments/add:id?', upload.any(), function(req, res, next){
  var id = req.params.id;
  var program;
  var s = req.body.sum;
  req.body.sum = Math.round(s * 100) / 100;
  Gist.findById(id, function(err, doc){
    if (err) {
      console.error('Error, no entry found');
    }
    program = doc.program;
    doc.balance += +req.body.sum;
    // var item = req.body;
    // if(req.files[0]){
    //   item.image = req.files[0].filename;
    // };
    // console.log(req.body);
    // doc.payments.push(item);
    doc.save();
    next(program);
    return;
  });
}, function(program, req, res, next){
  var item = {};
  console.log(program);
  if(req.files[0]){
    item.image = req.files[0].filename;
  };
  item.sum = req.body.sum;
  item.date = req.body.date;
  item.userID = req.params.id;
  item.program = program;
  next(item);
}, function(item, req, res, next){
  var data = new Payment(item);
  console.log(data);
  data.save(function (err) {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      res.sendStatus(200);
    }
  });
});















module.exports = router;
