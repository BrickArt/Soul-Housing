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



//===========================================
//------------------Router-------------------
//===========================================

//------------------GET--------------------
router.get('/residence', function(req, res, next){
  var items = {
    residences: [],
    houses: []
  };
  Residence.find().sort({created: -1})
  .then(function (doc){
    items.residences = doc;
    next(items);
  });


}, function(items, req, res, next){
  House.find()
  .then(function (doc){
    for (var i = 0; i < doc.length; i++) {
      var house = {
        _id: doc[i]._id,
        name: doc[i].name,
        address: doc[i].address
      }
      items.houses.push(house)
    }
    next(items);
  });


}, function(items, req, res, next){
  var result = [];
  for (var i = 0; i < items.residences.length; i++) {
    for (var y = 0; y < items.houses.length; y++) {
      if (items.houses[y]._id == items.residences[i].houseID) {
        var residence = {
          _id: items.residences[i]._id,
          userID: items.residences[i].userID,
          houseID: items.residences[i].houseID,
          house: items.houses[y].name,
          address: items.houses[y].address,
          room: items.residences[i].room,
          bed: items.residences[i].bed,
          price: items.residences[i].price,
          startDate: items.residences[i].startDate,
          endDate: items.residences[i].endDate
        }
        result.push(residence);
      }

    }
    if (i === items.residences.length - 1) {
      next(result)
    }
  }


}, function(result, req, res, next){

  res.send(result);
});



router.get('/residence/user_:id?', function(req, res, next){
  var id = req.params.id;
  var items = {
    residences: [],
    houses: []
  };
  Residence.find({userID: id}).sort({created: -1})
  .then(function (doc){
    items.residences = doc;
    next(items);
  });


}, function(items, req, res, next){
  House.find()
  .then(function (doc){
    for (var i = 0; i < doc.length; i++) {
      var house = {
        _id: doc[i]._id,
        name: doc[i].name,
        address: doc[i].address
      }
      items.houses.push(house)
    }
    console.log('aaaaa   ' + items)
    next(items);

  });


}, function(items, req, res, next){
  var result = [];
  for (var i = 0; i < items.residences.length; i++) {
    for (var y = 0; y < items.houses.length; y++) {
      if (items.houses[y]._id == items.residences[i].houseID) {
        console.log('1')
        
        var residence = {
          _id: items.residences[i]._id,
          userID: items.residences[i].userID,
          houseID: items.residences[i].houseID,
          house: items.houses[y].name,
          address: items.houses[y].address,
          room: items.residences[i].room,
          bed: items.residences[i].bed,
          price: items.residences[i].price,
          startDate: items.residences[i].startDate,
          endDate: items.residences[i].endDate
        }
        if (items.residences[i].description) {
          residence.description = items.residences[i].description;
        } else {
          residence.description = null;
        }
        result.push(residence);
      }

    }
    if (i === items.residences.length - 1) {
      console.log(items)
      next(result)
    }
  }


}, function(result, req, res, next){

  res.status(200).send(result);
});



//-------------------PLACE--------------------
router.post('/residence/place', function(req, res, next){
  var item = {};
  item.residence = req.body;
  console.log(req.body);
  var startDate = new Date;
  startDate.setHours(0, 0, 0, 0);

  item.residence.startDate = startDate;

  var data = new Residence(item.residence);
  item.resid = data._id;

  console.log(data);
  data.save(function (err) {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      next(item);
      return;
    }
  });
}, function(item, req, res, next){
  House.findById(item.residence.houseID).then(function(doc){
    item.houseName = doc.name;
    for (var i = 0; i < doc.rooms.length; i++) {
      if (doc.rooms[i].num == +item.residence.room) {
        for (var y = 0; y < doc.rooms[i].beds.length; y++) {
          if (doc.rooms[i].beds[y].num == +item.residence.bed){
            doc.rooms[i].beds[y].status = true;
            doc.rooms[i].beds[y].userID = item.residence.userID;
          }
        }
      }
    }
    console.log(doc);
    doc.save(function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        item.house = doc;
        next(item);
        return;
      }
    });
  });
}, function(item, req, res, next){
  Gist.findById(item.residence.userID).then(function(doc){
    console.log(doc);
    doc.status = true;
    doc.residence = item.resid;
    // doc.houseName = item.houseName;
    // doc.house.name = item.house.name;
    // doc.house.address = item.house.address;
    // doc.house.room = item.residence.room;
    // doc.house.bed = item.residence.bed;

    console.log(doc);
    doc.save(function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        res.sendStatus(200);
        return;
      }
    });
  })
});



//-------------------rePLACE--------------------
router.post('/residence/replace:id?', function(req, res, next){
  var item;
  var id = req.params.id;
  console.log(id);
  var endDate = new Date;
  endDate.setHours(0, 0, 0, 0);
  Residence.findById(id).then(function(doc){
    console.log(req.body);
    
    doc.endDate = endDate;
    doc.description = req.body.description;
    item = doc;
    console.log(doc);
    doc.save(function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        console.log('next');
        next(item);
      }
    });
  })

}, function(item, req, res, next){
  console.log(item);
  House.findById(item.houseID).then(function(doc){
    for (var i = 0; i < doc.rooms.length; i++) {
      if (doc.rooms[i].num == item.room) {
        for (var y = 0; y < doc.rooms[i].beds.length; y++) {
          if (doc.rooms[i].beds[y].num == item.bed){
            doc.rooms[i].beds[y].status = false;
            doc.rooms[i].beds[y].userID = null;
            console.log('house ok');
          }
        }
      }
    }
    doc.save(function(err){
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        next(item);
      }
    })
  });
}, function(item, req, res, next){
  Gist.findById(item.userID).then(function(doc){
    doc.status = false;
    doc.residence = null;

    doc.save(function(err){
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        if(!item.description){
          item.description = null;
        }
        res.status(200).send({
          _id: item._id,
          userID: item.userID,
          houseID: item.houseID,
          room: item.room,
          bed: item.bed,
          price: item.price,
          description: item.description
        })
      }
    })

  })
});













module.exports = router;
