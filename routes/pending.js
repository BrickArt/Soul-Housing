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
        next(item)
    })
}, function(item, req, res, next){
    var users = [];
    for (let i = 0; i < item.users.length; i++) {
        const user = item.users[i];
        if (user.residence) {
            for (let z = 0; z < item.resids.length; z++) {
                const resid = item.resids[z];
                if(user.residence === resid._id){
                    for (let n = 0; n < item.houses.length; n++) {
                        const house = item.houses[n];
                        if (resid.houseID === house._id) {
                            user.address = house.address; 
                        }
                    }
                } else {
                    user.address = null
                } 
            }
        }
        user.balance = 0
        var payments = [];
        for (let y = 0; y < item.pays.length; y++) {
            const pay = item.pays[y];
            if (user._id.toString() === pay.userID) {
                payments.push(pay)
                console.log('aa2345065894bce')  
            }
            
            if(user._id.toString() === pay.userID && pay.status != 'pending'){
                user.balance += +pay.sum;
            }
            
            if (y === item.pays.length - 1 && user.balance > 0) {
                payments.sort(function(a, b){
                    if(a.date < b.date) return 1
                    if(a.date > b.date) return -1
                })
                users.push({
                    _id: user._id,
                    name: user.name,
                    lastname: user.lastname,
                    address: user.address,
                    balance: user.balance,
                    program: user.program,
                    status: user.status,
                    image: user.image,


                    payments: payments
                });
                console.log(users)
            }
        }

        if(i === item.users.length - 1){
            res.status(200).render('unpaid', {
                items: users.sort({balance: 1}), 
                guestID: req.params.id
            })
        }
    }
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
        next(item)
    })
}, function(item, req, res, next){
    var users = [];
    for (let i = 0; i < item.users.length; i++) {
        var addr;
        const user = item.users[i];
        if (user.status) {
            for (let z = 0; z < item.resids.length; z++) {
                const resid = item.resids[z];
                if(user.residence === resid._id.toString()){
                    for (let n = 0; n < item.houses.length; n++) {
                        const house = item.houses[n];
                        if (resid.houseID === house._id.toString()) {
                            user.address = house.address; 
                            console.log(addr)
                        }
                    }
                } else {
                    addr = null
                } 
            }
        }
        user.balance = 0
        var payments = [];
        for (let y = 0; y < item.pays.length; y++) {
            const pay = item.pays[y];
            if (user._id.toString() === pay.userID) {
                payments.push(pay)
                console.log('aa2345065894bce')  
            }
            
            if(user._id.toString() === pay.userID && pay.status != 'pending'){
                user.balance += +pay.sum;
            }
            
            if (y === item.pays.length - 1 && user.balance > 0) {
                users.push({
                    _id: user._id,
                    name: user.name,
                    lastname: user.lastname,
                    address: user.address,
                    balance: user.balance,
                    program: user.program,
                    status: user.status,


                    payments: payments
                });
                console.log(users)
            }
        }

        if(i === item.users.length - 1){
            res.send(users)
        }
    }
// }, function(item, req, res, next){
//     for (let i = 0; i < item.users.length; i++)
});


module.exports = router;