var express = require('express');
var router = express.Router();


var checkAuth = require('../middleware/checkAuth');



//===========================================
//-----------------DataBase------------------
//===========================================
var House = require('../models/house').House;
var Gist = require('../models/gist').Gist;
var Residence = require('../models/residence').Residence;
var Test = require('../models/test').Test;
var Payment = require('../models/payment').Payment;
var Program = require('../models/program').Program;
var Type = require('../models/type').Type;



//===========================================
//------------------Router-------------------
//===========================================

//------------------GET--------------------
router.get('/api/types', function(req, res, next){
    Type.find()
  .then(function (doc){

    res.send(doc);
    console.log(doc);
  });
  return;
});



//-------------------ADD--------------------
router.post('/api/types/add', function(req, res, next){

  var item = {
    name: req.body.name
  };
  console.log(req.body)
  var data = new Type(item);
  data.save(function(err){
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      res.send(200, 'Place is created!')
      return;
    }
  })
});











module.exports = router;
