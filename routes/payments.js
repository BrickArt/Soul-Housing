// var Gist = require('../models/gist').Gist;
// var Payment = require('../models/payment').Payment;


// exports.get = function(req, res, next) {
//   var openGist = req.params.id
//   console.log("params is -------------- " + req.params.id)
//   Gist.find()
//     .then(function (doc){
//       res.render('payments', {gists: doc, gistId: openGist});
//       console.log(doc)
//     });
// };

// exports.post = function (req, res, next) {
//   var openGist = req.params.id
//   res.render('payments/add', {gistId: openGist});
// };

// exports.save = function (req, res, next) {
//   var id = req.params.id;

//   Gist.findById(id, function (err, doc){
//     if (err) {
//       console.error('Error, no entry found');
//     }
//     var item = {
//       date: req.body.date,
//       sum: req.body.sum,
//       type: req.body.type,
//       program: doc.program
//     };
//     var data = new Payment(item);
//     doc.payments.push(data);
//     doc.balance += +req.body.sum;
//     doc.save();
//     data.save();

//     res.sendStatus(200);
//   });

// };
