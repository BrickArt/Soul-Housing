var express = require('express');
var router = express.Router();


var checkAuth = require('../../middleware/checkAuth');



//===========================================
//-----------------DataBase------------------
//===========================================
var House = require('../../models/house').House;
var Gist = require('../../models/gist').Gist;
var Residence = require('../../models/residence').Residence;
var Test = require('../../models/test').Test;
var Payment = require('../../models/payment').Payment;
var Program = require('../../models/program').Program;



//===========================================
//------------------Router-------------------
//===========================================

//------------------GET--------------------
router.get('/program', function(req, res, next){
  Program.find()
  .then(function (doc){

    res.send(doc);
    console.log(doc);
  });
  return;
});



//-------------------ADD--------------------
router.post('/payments/add', function(req, res, next){

  var item = {
    abbr: req.body.date,
    fullname: req.body.sum
  };

  var data = new Program(item);
  data.save(function(err){
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      res.send(200, 'Place is created!')
      return;
    }
  })

  res.sendStatus(200);

});











module.exports = router;
