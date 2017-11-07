var fs = require('fs');
var async = require('async');

//===========================================
//-----------------DataBase------------------
//===========================================
var House = require('../models/house').House;
var Gist = require('../models/gist').Gist;
var Residence = require('../models/residence').Residence;
var Room = require('../models/room').Room;
var Bed = require('../models/bed').Bed;
var Test = require('../models/test').Test;

//===========================================
//------------------Router-------------------
//===========================================
exports.get = function(req, res, next) {
  var id = req.params.id;
  House.find()
  .then(function(doc){
    res.render('houses', {houses: doc, houseID: id})
  });
};

exports.post = function (req, res, next) {
  res.render('houses/add');
};




exports.save = function (req, res, next) {
  console.log('BODY IS ----' + req.body.rooms);
  console.log(req.body);

  var rooms = req.body.rooms;
  var n = [];
  var a = [];
  if(rooms){
    rooms.forEach(function (room, i, rooms){
      a = [];
      for(y = 0; y < room; y++){
        a.push({
          num: ++y
        })
      }
      n.push({
        num: ++i,
        beds: a
      });
    });
  }
}, function(req, res, next){
  console.log('arguments');
  res.end()
  // var item = req.body;
  // item.rooms = n;
  // if(req.files[0]){
  //   item.image = req.files[0].filename;
  // };
  // console.log(req.files)
  //
  // var data = new House(item);
  //
  // data.save(function (err) {
  //   if (err) {
  //     console.log(err);
  //     res.sendStatus(403);
  //   } else {
  //     res.sendStatus(200);
  //   }
  // });
};


exports.delete = function(req, res, next) {
  var id = req.body.id
  console.log(req.body)
  House.findById(id, function(err, doc){
    if (err) {
      console.error('Error, no entry found');
    }
    if (doc.image){
      fs.unlink('./public/img/upload/house/' + doc.image, function (err){
        if (err) throw err;
        console.log('successfully deleted - ' + doc.image);
      });
    };
  })
  House.findByIdAndRemove(id).exec();
  res.sendStatus(200);
};

exports.edit = function(req, res, next) {
  var id = req.body.id;
  console.log(req.body)
  House.findById(id, function (err, doc){
    if (err) {
      console.error('Error, no entry found');
    }

    res.render('houses/edit', doc);
  });

};

exports.update = function(req, res, next) {
  var rooms = req.body.rooms;
  var n = [];
  var a = [];
  rooms.forEach(function (room, i, rooms){
    a = [];
    for(y = 0; y < room; y++){
      a.push({
        num: ++y,
        status: false
      })
    }
    n.push({
      num: ++i,
      beds: a
    });
  });

  var id = req.params.id;
  console.error(req.body);




  House.findById(id, function (err, doc){
    if (err) {
      console.error('Error, no entry found');
    }
    if (req.files[0]){
      if (doc.image){
        fs.unlink('./public/img/upload/house/' + doc.image, function (err){
          if (err) throw err;
          console.log('successfully deleted - ' + doc.image);
        })
      }
      doc.image = req.files[0].filename
    }
    doc.name = req.body.name;
    doc.address = req.body.address;
    doc.discription = req.body.discription;
    doc.rooms = n;
    console.log('doc' + doc);
    doc.save(function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      } else {
        res.sendStatus(200);
      }
    });
  });
  console.log('body', req.body)
  console.log('file', req.files)

};

exports.room = function(req, res, next) {
  res.render('houses/room', req.body);
};

exports.data = function(req, res, next) {
  var id = req.params.id
  House.findById(id, function(err, doc){
    if (err) throw err;
  }).then(function(rooms){
    res.send(rooms);
  });
};



exports.place = function (req, res, next){
  Gist.find()
    .then(function (doc){

      res.render('houses/place', {gists: doc});
      console.log(doc)
    });
}

exports.placeSave = function (req, res, next) {
  var id = req.body.houseID;
  console.log('=========================================================================');
  console.log(req.body)
  console.log('=========================================================================');
  var house;
  House.findById(id).exec(function (err, doc) {
    if (err) {
      console.error('Error, no entry found');
    }
    var house = doc.name;
    var roomIndex = +req.body.room - 1;
    var bedIndex = +req.body.bed - 1
    console.log('***********************************************************');
    console.log(doc.rooms[roomIndex].beds[bedIndex].status, 'docHouse');
    console.log('***********************************************************');

    doc.rooms[roomIndex].beds[bedIndex].status = true;
    doc.rooms[roomIndex].beds[bedIndex].userID = req.body.userID;



    doc.save(function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      }
      console.log('house is saved>>>>>>>>>>>>>>>');
    });
  });



  Gist.findById(req.body.userID, function (err, doc){
    if (err) {
      console.error('Error, no entry found');
    }
    console.log(doc, 'docuser');
    doc.status = true;
    doc.residence = house;
    console.log(doc, 'docuser');
    doc.save(function (err) {
      if (err) {
        console.log(err);
        res.sendStatus(403);
      }
    });
  });


  var startDate = new Date;
  startDate.setHours(0, 0, 0, 0);

  var item = {
    userID: req.body.userID,
    houseID: req.body.houseID,
    room: req.body.room,
    bed: req.body.bed,
    prise: req.body.prise,
    startDate: startDate
  }

  var data = new Residence(item);
  data.save(function (err) {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      res.sendStatus(200);
    }
  });

};

exports.openPlace = function (req, res){
  var id = req.params.id
  Gist.findById(id, function (err, doc) {
    if (err) {
      console.error('Error, no entry found');
      res.sendStatus(403);
    } else {
      res.render('houses/place', {gist: doc});

    }
    console.log(doc)
  });
};
