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

router.post('/unpaid', function(req, res, next){
    var items = {};
    items.time = new Date();
   

    Residence.find({endDate: null}).then(function(doc){
        if(doc.length > 0){
            items.residence = doc;
            console.log('residence', items.residence)
            return next(items);
        } else {
            res.sendStatus(403)
        }
    })

}, function(items, req, res, next){
    var sum = 0;
    for (let i = 0; i < items.residence.length; i++) {
        const element = items.residence[i];
        var pay = new Payment({
            date: new Date(),
            sum: element.price,
            type: null,
            program: null,
            status: 'system',
            userID: element.userID
        });
        pay.save(function (err) {
            if (err) {
              console.log(err);
              res.sendStatus(403);
            }
          });
        sum += element.price;
        
        if(i === items.residence.length - 1){
            var s = new Date();
            var n = s - items.time

            var log = new Unpaid({
                date: new Date(),
                count: i,
                sum: sum,
                timeout: n/1000 + ' ms',
            })
            log.save(function (err) {
                if (err) {
                  console.log(err);
                  res.sendStatus(403);
                }
              });

            console.log(n/1000 + ' ms')
            res.status(200).send('unpaid is success')
        }

        
    }
});



module.exports = router;