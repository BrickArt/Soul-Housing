var mongoose = require('mongoose');
var log = require('../lib/log')(module);
var config = require('nconf');

// Установим соединение с базой
mongoose.Promise = require('bluebird');
mongoose.connect(config.get('mongoose:uri'), config.get('mongoose:options'));

mongoose.connection.on('connected', function() {
  log.info('DB connected');
});


// mongoose.connection.on('error', function(err)  {
  //   console.error("Mongoose error", err);
  // });
  
  
  
  log.info("DB initialized");
module.exports = mongoose;