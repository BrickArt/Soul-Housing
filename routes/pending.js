var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');



//===========================================
//-----------------DataBase------------------
//===========================================
var House = require('../models/house').House;
var Gist = require('../models/gist').Gist;
var Residence = require('../models/residence').Residence;
var Test = require('../models/test').Test;
var Payment = require('../models/payment').Payment;
var Program = require('../models/program').Program;
var Unpaid = require('../models/unpaid').Unpaid;



//===========================================
//------------------Router-------------------
//===========================================


router.get('/pending', function(req, res, next){
    res.render('pending');
});


module.exports = router;