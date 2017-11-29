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


// router.get('/unpaid', function(req, res, next){
//     res.render('unpaid');
// });

router.get('/unpaid:id?', function(req, res, next){
    Gist.find().sort({name: 1})
      .then(function(doc){
        // console.log(doc);
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
          // console.log(doc);
        next(items);
        return;
      });
  }, function(items, req, res, next){
    // console.log(items);
    res.render('unpaid', {guests: items.users, payments: items.payments, guestID: req.params.id})
  });
  
router.get('/payments/payment_:id?', function(req, res, next){
    var id = req.params.id;
    Payment.findById(id).then(function(doc){
        res.send({
            _id: doc._id,
            date: doc.date,
            sum: doc.sum,
            type: doc.type,
            status: doc.status,
            image: doc.image,
            userID: doc.userID
        })
    });
});


router.get('/unpaid/data', function(req, res, next){
    Gist.find().then(function(doc){
        next({
            users: doc
        });
    });
}, function(item, req, res, next){
    Payment.find().then(function(doc){
        item.pays = doc;
        next(item);
    });
}, function(item, req, res, next){
    Residence.find({endDate: null}).then(function(doc){
        item.resids = doc;
        next(item);
    })
}, function(item, req, res, next){
    House.find().then(function(doc){
        item.houses = doc;
        res.status(200).send(item)
    })
});


module.exports = router;