var mongoose = require('../lib/mongoose'),
      Schema = mongoose.Schema;

var schema = new Schema({
  abbr: {
    type: String
  },
  fullname: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

exports.Program = mongoose.model('Program', schema);
