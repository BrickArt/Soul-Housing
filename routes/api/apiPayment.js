var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');

var checkAuth = require('../../middleware/checkAuth');

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
var House = require('../../models/house').House;
var Gist = require('../../models/gist').Gist;
var Residence = require('../../models/residence').Residence;
var Test = require('../../models/test').Test;
var Payment = require('../../models/payment').Payment;



//===========================================
//------------------Router-------------------
//===========================================

//------------------GET--------------------
router.get('/payments', function(req, res, next){
  Gist.find()
  .then(function (doc){
    for (var i = 0; i < doc.length; i++) {
      doc[i].image = 'img/upload/guest/' +  doc[i].image;
      Residence.findById(doc[i].residence).then(function(resid){
        House.findById(resid.houseID).then(function(house){
          doc[i].houseName = house._id
          console.log(doc[i]);

        })
      });
    }
    res.send(doc);
    console.log(doc);
  });
  return;
});
//------------------GET--------------------
router.get('/payments/user_:id?', function(req, res, next){
  if (req.params.id){
    var id = req.params.id
    Payment.find({userID: id})
    .then(function (doc){
      res.send(doc);
      console.log(doc);
    }).catch(function(err){
      res.status(403).send('Payments not found')
    });
    return;
  }
});



//-------------------ADD--------------------
router.post('/payments/add/user_:id?', upload.any(), function(req, res, next){
  var id = req.params.id;
  var s = req.body.sum;
  req.body.sum = Math.round(s * 100) / 100;
  var date = new Date(req.body.date)
  var now = new Date;
  now.setHours(0, 0, 0, 0);
  var status = 'done';
  if(date > now){
    status = 'pending';
  }
  var item = {
    date: date,
    sum: req.body.sum,
    type: req.body.type,
    program: req.body.program,
    userID: id,
    status: status
  };
  if(req.files[0]){
    item.image = req.files[0].filename;
  };
  var data = new Payment(item);
  data.save(function (err) {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      res.send(data);
    }
  });
});



//--------------------------edit-------------------------
router.post('/payments/edit/payment_:id?', upload.any(), function(req, res, next){
  var id = req.params.id;
  Payment.findById(id).then(function(doc){
    if(req.files[0]){
      doc.image = req.files[0].filename;
    };
    if(req.body.sum){
      var s = req.body.sum;
      req.body.sum = Math.round(s * 100) / 100;
      doc.sum = req.body.sum;
    };
    if(req.body.date){
      doc.date = req.body.date;
    };
    if(req.body.type){
      doc.type = req.body.type;
    };
    if(req.body.status){
      doc.status = req.body.status;
    };
    var date1 = new Date(req.body.date)
    var date2 = new Date().setHours(0, 0, 0, 0);
    if(date1 > date2){
      doc.status = "pending";
    };
    doc.save(function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        res.send({
          _id: doc._id,
          date: doc.date,
          sum: doc.sum,
          type: doc.type,
          status: doc.status,
          program: doc.program
        });
      }
    });
  }).catch(function(err){
    res.status(403).send('Payment not found')
  });
});

//--------------------------delete-------------------------
router.post('/payments/delete/payment_:id?', function(req, res, next){
  var id = req.params.id;
  Payment.findById(id).then(function(doc){
    if (doc.image){
      // fs.unlink('./public/img/upload/house/' + doc.image, function (err){
      //   if (err) console.log('image not found - ' + doc.image);
      //   console.log('successfully deleted - ' + doc.image);
      // });
    };
    next(id);
  }).catch(function(err){
    res.status(403).send('Payment not found')
  })
}, function(id, req, res, next){
  Payment.findByIdAndRemove(id).then(function(){
    res.sendStatus(200);
  });
});

//-------------------pending---------------------------
router.get('/payments/pending', function(req, res, next){
Payment.find({status: 'pending'}).then(function(doc){
    next(doc);
  });
}, function(pay, req, res, next){
  Gist.find().then(function(doc){
    next({
      pay: pay,
      users: doc
    });
  });
}, function(items, req, res, next){
  var result = [];
  for (let i = 0; i < items.pay.length; i++) {
    const pay = items.pay[i];
    var date1 = new Date(pay.date);
    var date2 = new Date();
    
      console.log('aaappp')
      for (let y = 0; y < items.users.length; y++) {
        const user = items.users[y];
        
        if (pay.userID === user._id.toString() && date1 < date2) {
          // if (pay.userID === user._id.toString()) {
          result.push({
            _id: pay._id,
            userID: user._id,
            name: user.name,
            lastname: user.lastname,
            program: pay.program,
            date: pay.date,
            sum: pay.sum,
            status: pay.status
          })
        }
        
      }
      if (i === items.pay.length - 1) {
        res.send(result)
      }
    
    
  }



});








module.exports = router;
