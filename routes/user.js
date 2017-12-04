var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var Jimp = require("jimp");

var checkAuth = require('../middleware/checkAuth');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/upload/guest')
  },
  filename: function (req, file, cb) {
    cb(null, 'guest_' + Date.now() + '.' + file.mimetype.split('/')[1])
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



//===========================================
//------------------Router-------------------
//===========================================

//------------------GET--------------------
router.get('/users/user_:id', function(req, res, next){
  var id = req.params.id;
  if(id){
    Gist.findById(id, function(err, doc){
      if (err) throw err;
      next(doc);
      return;
    });
  } else {
    res.status(403).send('User not found')
  }
}, function(guest, req, res, next){
  res.send(guest)
});

//------------------USERS--------------------
router.get('/users:id?', function(req, res, next){
  Gist.find().sort({name: 1})
    
    .then(function(doc){
      if(doc.length === 0){
        res.render('users')
        return;
      }
      var items = {
        users: doc
      };
      next(items);
      return;
    });
}, function(items, req, res, next){
  if(req.params.id){
    var id = req.params.id;
  } else {
    var id = items.users[0]._id
  }
  Residence.find().sort({created: -1})
    .then(function(doc){
        items.residences = doc;
        console.log(doc);
      next(items);
      return;
    });
}, function(items, req, res, next){
  if (items.residences.length > 0){
    var id;
    for (var i = 0; i < items.residences.length; i++) {
      if (items.residences[i].endDate == null){
        id = items.residences[i].houseID;
        console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
        console.log(id);
        console.log("IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
        break;
      }
    }
    House.findById(id, function(err, doc){
      items.house = doc;
      next(items);
    });
  } else {
    next(items);
  }
}, function(items, req, res, next){
  Program.find()
    .then(function(doc){
        items.programs = doc;
      next(items);
      return;
    });
}, function(items, req, res, next){
  House.find()
    .then(function(doc){
        items.houses = doc;
      next(items);
      return;
    });
}, function(items, req, res, next){
  var id = req.params.id;
  console.log(items);
  res.render('users', {
    gists: items.users,
    guestID: id,
    programs: items.programs,
    residences: items.residences,
    house: items.house,
    houses: items.houses
  });
});

//-------------------ADD--------------------
router.post('/users/add', upload.any(), function(req, res, next){
  if(req.files[0]){
    Jimp.read(req.files[0].destination + '/' + req.files[0].filename, function (err, image) {
      if (err) throw err;
      image.quality(60)
           .exifRotate() 
           .write(req.files[0].destination + '/' + req.files[0].filename); // save 
      next()
      });

  } else {
    next()
  }
}, function(req, res, next){
  var item = req.body.rooms;
  console.log(req.body);
  var b = [];
  var r = [];
  item.forEach(function (room, i, rooms){
    b = [];
    for (var y = 0; y < room; y++) {
      b.push({
        num: y+1
      });
    };
    r.push({
      num: i+1,
      beds: b
    })
  });
  next(r);
}, function(rooms, req, res, next){
  var item = req.body;
  item.rooms = rooms;
  if(req.files[0]){
    item.image = req.files[0].filename;
  };
  next(item);
}, function(guest, req, res, next){
  var data = new Gist(guest);
  data.save(function (err) {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      res.sendStatus(200);
    }
  });
});

//-------------------UPDATE--------------------
router.post('/users/update:id?', upload.any(), function(req, res, next){
  if(req.files[0]){
    Jimp.read(req.files[0].destination + '/' + req.files[0].filename, function (err, image) {
      if (err) throw err;
      image.quality(60)
           .exifRotate() 
           .write(req.files[0].destination + '/' + req.files[0].filename); // save 
      next()
      });

  } else {
    next()
  }
}, function(req, res, next){
  var id = req.params.id;
  Gist.findById(id, function (err, doc){
    if (err) {
      console.error('Error, no entry found');
    }
    next(doc);
    return;
  });
}, function(guest, req, res, next){
  if (req.files[0]){
    if(guest.image){
      try {
        fs.unlink('./public/img/upload/guest/' + guest.image, function (err){
          if (err) {
            console.error('Error, no entry found');
          }
        });
      } catch (err) {
        return;
      };
    };
    guest.image = req.files[0].filename
  };
  next(guest);
}, function(guest, req, res, next){
  var id = req.params.id;
  Gist.findById(id, function (err, doc){
    if (err) {
      console.error('Error, no entry found');
    }
    doc.name = req.body.name;
    doc.lastname = req.body.lastname;
    doc.dateOfBirth = req.body.dateOfBirth;
    doc.gender = req.body.gender;
    doc.address = req.body.address;
    doc.phone = req.body.phone;
    doc.program = req.body.program;
    doc.description = req.body.description;
    doc.image = guest.image;

    doc.save();
    return;
  });
  res.sendStatus(200);

});

//-------------------DELETE--------------------
router.post('/users/delete/user_:id?', function(req, res, next){
  var id = req.params.id;
  Gist.findById(id, function(err, doc){
    if (err) {
      console.error('Error, no entry found');
    }
    if (doc.image !== undefined){
      fs.unlink('./public/img/upload/gists/' + doc.image, function (err){
        if (err) {
          console.error('Image, no entry found');
        }
        console.log('successfully deleted - ' + doc.image);
      });
    };
    if(doc.status){
      res.status(403).send('User is active')
    } else {
      next(id);
    }
  });
}, function(id, req, res, next){
  Gist.findByIdAndRemove(id).exec();
  res.sendStatus(200);
});

//-------------------PLACE--------------------
router.post('/users/place/user_:id?', function(req, res, next){
  var s = req.body.price;
  req.body.price = Math.round(s * 100) / 100;
  if (req.session.placeH == null){
    console.log('have no house');
    console.log(req.session);
    req.session.placeU = id;
    res.sendStatus(200)
  } else {
    next();
  }
}, function(req, res, next){
  var items = {
    house: {},
    residence: {},
  }
  var house = req.session.placeH;
  var id = req.params.id;
  console.log(house);

  House.findById(house.houseID, function(err, doc){
    if (err) {
      console.error('Image, no entry found');
    }
    for (var i = 0; i < doc.rooms.length; i++) {
      if (doc.rooms[i].num == house.room){
        for (var y = 0; y < doc.rooms[i].beds.length; y++) {
          if (doc.rooms[i].beds[y].num == house.bed){
            doc.rooms[i].beds[y].status = true;
            doc.rooms[i].beds[y].userID = id;
            console.log(doc.rooms[i].beds[y].num);
          }
          console.log(doc.rooms[i].num);
        }
      }
      if (i === doc.rooms.length - 1) {
        items.house.name = doc.name;
        items.house.address = doc.address;
        doc.save(function (err) {
          if (err) {
            console.log(err);
            res.sendStatus(403);
          } else {
            next(items);
          }
        });
      }
    }
  });

}, function(items, req, res, next){
  var id = req.params.id;
  var house = req.session.placeH;

  var startDate = new Date;
  startDate.setHours(0, 0, 0, 0);


  var residence = new Residence();
  residence.userID = id;
  residence.houseID = house.houseID;
  residence.room = house.room;
  residence.bed = house.bed;
  residence.price = house.price;
  residence.startDate = startDate;
  residence.save(function (err) {
  items.residence = residence;
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      console.log(items);
      next(items)
    }
  });

}, function(items, req, res, next){
  var id = req.params.id;
  var house = req.session.placeH;

  Gist.findById(id, function(err, doc){
    if (err) {
      console.error('Image, no entry found');
    }


    doc.status = true;
    if (items.residence){
      doc.residence = items.residence._id
    }
    doc.save(function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        req.session.placeH = null;
        req.session.placeU = null;
        res.sendStatus(200);
      }
    });
  });
});


//-------------------REPLACE--------------------
router.post('/users/replace/user_:id?', function(req, res, next){
  console.log('repl');
  var id = req.params.id;
  var items = {};
  var endDate = new Date;
  endDate.setHours(0, 0, 0, 0);
  console.log(req.body);
  Residence.findById(id).then(function(doc){
    doc.endDate = endDate;
    console.log(doc);
    items.residence = doc;
    doc.save(function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        console.log('ok');
        next(items);
      }
    });
  })
}, function(items, req, res, next){
  Gist.findById(items.residence.userID, function(err, doc){
    if (err) {
      console.error('Guest, no entry found');
    }
    var sum = ((+items.residence.startDate - +items.residence.endDate)/1000/60/60/24)*items.residence.price
    doc.status = false;
    doc.residence = null;

    doc.balance += sum;
    doc.save(function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        next(items)
      }
    });
  });
}, function(items, req, res, next){
  House.findById(items.residence.houseID, function(err, doc){
    if (err) {
      console.error('Image, no entry found');
    }
    for (var i = 0; i < doc.rooms.length; i++) {
      if (doc.rooms[i].num == items.residence.room){
        for (var y = 0; y < doc.rooms[i].beds.length; y++) {
          if (doc.rooms[i].beds[y].num == items.residence.bed){
            doc.rooms[i].beds[y].status = false;
            doc.rooms[i].beds[y].userID = null;

            console.log(doc.rooms[i].beds[y].num);
          }
          console.log(doc.rooms[i].num);
        }
      }
    }
    doc.save(function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        next(items)
      }
    });
  });
}, function(items, req, res, next){
  res.sendStatus(200)
});


//------------------GET--------------------
router.get('/users/history:id?', function(req, res, next){
  var id = req.params.id;
  Residence.find({userID: id}).then(function(doc){
    next(doc);
    return;
  });
}, function(guest, req, res, next){
  res.send(guest)
});










module.exports = router;
