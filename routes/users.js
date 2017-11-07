var fs = require('fs');

//===========================================
//-----------------DataBase------------------
//===========================================
var Gist = require('../models/gist').Gist;
var Program = require('../models/program').Program;



//===========================================
//------------------Router-------------------
//===========================================
exports.get = function(req, res, next) {
  var openGist = req.params.id
  console.log("params is -------------- " + req.params.id)
  console.log(req.search, 'BODY')
  Gist.find()
    .then(function (doc){
      res.render('users', {gists: doc, gistId: openGist});
      console.log(doc)
    });
};

exports.post = function (req, res, next) {
  Program.find()
    .then(function (doc){
      console.log(doc)
      res.render('users/add', {programs: doc});
    });
};

exports.save = function (req, res, next) {
  console.log(req.body);
  var item = req.body;
  if (req.files[0]){
    item.image = req.files[0].filename;
  }
  var data = new Gist(item);

  data.save(function (err) {
    if (err) {
      console.log(err);
      res.sendStatus(403);
    } else {
      res.sendStatus(200);
    }
  });
};

exports.delete = function(req, res, next) {
  var id = req.body.id;
  console.log(req.body);
  Gist.findById(id, function(err, doc){
    if (err) {
      console.error('Error, no entry found');
    }
    if (doc.image !== undefined){
      fs.unlink('./public/img/upload/gists/' + doc.image, function (err){
        if (err) {
          console.log('successfully deleted - ' + doc.image);
        }
      });
    };
  })
  Gist.findByIdAndRemove(id).exec();
  res.sendStatus(200);
};

exports.edit = function(req, res, next) {
  var id = req.body.id;
  console.log(req.body)
  Gist.findById(id, function (err, doc){
    if (err) {
      console.error('Error, no entry found');
    }
    res.render('users/edit', doc);
  });

};

exports.update = function(req, res, next) {
  var id = req.params.id;
  Gist.findById(id, function (err, doc){
    if (err) {
      console.error('Error, no entry found');
    }
    if (req.files[0]){
      if(doc.image){
        try {
          fs.unlink('./public/img/upload/gists/' + doc.image, function (err){
            if (err) {
              console.log('successfully deleted - ' + doc.image);
            }
          });
        } catch (e) {
          return;
        }

      }
      doc.image = req.files[0].filename
    }
    doc.name = req.body.name;
    doc.lastname = req.body.lastname;
    doc.dateOfBirth = req.body.dateOfBirth;
    doc.gender = req.body.gender;
    doc.address = req.body.address;
    doc.phone = req.body.phone;
    doc.program = req.body.program;
    doc.discription = req.body.discription;

    doc.save();

  });
  res.send(200);
};

exports.history = function(req, res, next) {
  var id = req.params.id;
  Gist.findById(id, function (err, doc){
    if (err) {
      console.error('Error, no entry found');
    }
    res.sendStatus(200);
  });

};
