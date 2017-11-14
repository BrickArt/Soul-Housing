var express = require('express');
var router = express.Router();

var path = require('path');
var multer = require('multer');

var checkAuth = require('../middleware/checkAuth');


//===========================================
//------------------Config-------------------
//===========================================
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/upload/house')
  },
  filename: function (req, file, cb) {
    cb(null, 'house_' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
})

var upload = multer({ storage: storage })

var storageUser = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/img/upload/gists')
  },
  filename: function (req, file, cb) {
    cb(null, 'gist_' + Date.now() + '.' + file.mimetype.split('/')[1])
  }
})
var uploadUser = multer({ storage: storageUser })
//===========================================
//------------------Router-------------------
//===========================================


//====================Index=====================
//------------------Home page------------------
router.get('/', function(req, res) {
  res.render('index');
});
//------------------Login-------------------
router.post('/login', require('./login').post);

//------------------TEST-------------------


// ===================Content====================
// -------------------Houses---------------------
//router.get('/houses:id?', require('./houses').get);
//---------------------add
//router.post('/houses', checkAuth, require('./houses').post);
// router.post('/houses/save', checkAuth, upload.any(), require('./houses').save);
// //---------------------del
// router.post('/houses/delete', checkAuth, require('./houses').delete);
// //---------------------edit
// router.post('/houses/edit', checkAuth, require('./houses').edit);
// router.post('/houses/update:id?', checkAuth, upload.any(), require('./houses').update);
// // //---------------------room
// router.post('/houses/room',  require('./houses').room);
// router.post('/houses/data:id?', require('./houses').data);
//
// router.post('/houses/place', checkAuth, require('./houses').place);
// router.post('/houses/place/save', checkAuth, require('./houses').placeSave);
// router.post('/houses/place/open:id?', checkAuth, require('./houses').openPlace);
//
//
// //-------------------Users---------------------
// router.get('/users:id?', checkAuth, require('./users').get);
// //---------------------add
// router.post('/users', checkAuth, require('./users').post);
// router.post('/users/save', checkAuth, uploadUser.any(), require('./users').save);
// //---------------------del
// router.post('/users/delete', checkAuth, require('./users').delete);
// //---------------------edit
// router.post('/users/edit', checkAuth, require('./users').edit);
// router.post('/users/update:id?', checkAuth, uploadUser.any(), require('./users').update);
// //---------------------History
// router.post('/users/history:id?', checkAuth, require('./users').history);


//
// //-------------------Payments---------------------
// router.get('/payments:id?', checkAuth, require('./payments').get);
// //---------------------add
// router.post('/payments:id?', checkAuth, require('./payments').post);
// router.post('/payments/save:id?', checkAuth, require('./payments').save);



module.exports = router;
