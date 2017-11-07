var assert = require('assert');
var HttpError = require('../error').HttpError;

module.exports = function(req, res, next) {
  if (!req.session.user) {
    res.redirect('/');
    // return next(new HttpError(401, "Вы не авторизованы"));
  }

  next();
};
