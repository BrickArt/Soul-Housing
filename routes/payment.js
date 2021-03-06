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

var log = require('../lib/log')(module);



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
router.get('/payments:id?', function(req, res, next){
  
  Gist.find().sort({name: 1})
  .then(function(doc){
    var items = {
      users: doc
    };
      if(doc.length > 0){
        return next(items);
      }else{
        
        console.log('not payments')
        return res.render('payments');
      }
      // console.log(doc);
      
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
  res.render('payments', {guests: items.users, payments: items.payments, guestID: req.params.id})
});

router.get('/payments/payment_:id?', function(req, res, next){
  var id = req.params.id;
  if(id){
    Payment.findById(id).then(function(doc){
      console.log(doc)
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
  } else {
    return res.status(403).send('User id not found!')
  }
});

//-------------------ADD--------------------
router.post('/payments/add:id?', upload.any(), function(req, res, next){
  console.log(req.body)
  var id = req.params.id;
  var program;
  var s = req.body.sum;
  req.body.sum = -(Math.round(s * 100) / 100);
  Gist.findById(id, function(err, doc){
    if (err) {
      console.error('Error, no entry found');
    }
    program = doc.program;

    doc.save(function (err) {
      if (err) {
        // console.log(err);
        log.error(err)
        res.sendStatus(403);
      } else {
        
        return next(program);
      }
    });
    
  });
}, function(program, req, res, next){
  console.log('azza')
  var item = {};
  var date = new Date(req.body.date)
  var now = new Date;
  now.setHours(0, 0, 0, 0);
  var status = 'done';
  if(date > now){
    status = 'pending';
  }
  // console.log(program);
  if(req.files[0]){
    item.image = req.files[0].filename;
  };
  item.sum = req.body.sum;
  item.date = req.body.date;
  item.type = req.body.type;
  item.userID = req.params.id;
  item.program = program;
  item.status = status;
  next(item);
}, function(item, req, res, next){
  var data = new Payment(item);
  // console.log(data);
  data.save(function (err) {
    if (err) {
      // console.log(err);
      log.error(err)
      res.sendStatus(403);
    } else {
      log.info('Payment is added #' + data._id)
      res.sendStatus(200);
    }
  });
});



//--------------------------edit-------------------------
router.post('/payments/edit/payment_:id?', upload.any(), function(req, res, next){
  var id = req.params.id;
  
  console.log(req.body)
  Payment.findById(id).then(function(doc){
    console.log(doc)
    if (req.files) {
      if(req.files[0]){
        doc.image = req.files[0].filename;
      };
    }
    if(req.body.sum){
      var s = req.body.sum;
      req.body.sum = -(Math.round(s * 100) / 100);
      doc.sum = +req.body.sum;
    };
    if(req.body.date){
      var date = new Date(req.body.date)
      doc.date = date;
    };
    if(req.body.type){
      doc.type = req.body.type;
    };
    var date1 = new Date(req.body.date)
    var date2 = new Date().setHours(0, 0, 0, 0);
    if(date1 > date2){
      doc.status = "pending";
    };
    if(req.body.status){
      doc.status = req.body.status;
      
    }
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
          program: doc.program,
          userID: doc.userID
        });
      }
    });
  });
});

//--------------------------delete-------------------------
router.post('/payments/delete/payment_:id?', function(req, res, next){
  var id = req.params.id;
  Payment.findById(id).then(function(doc){
    if (doc.image){
      fs.unlink('./public/img/upload/house/' + doc.image, function (err){
        if (err) console.log('file not defind' + doc.image);
      });
    };
    next(id);
  })
}, function(id, req, res, next){
  Payment.findByIdAndRemove(id).then(function(){
    res.sendStatus(200);
  });
});



module.exports = router;
