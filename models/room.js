var mongoose = require('../lib/mongoose'),
      Schema = mongoose.Schema;

var schema = new Schema({
  num: {
    type: Number
  },
  beds: {
    type: Array
  },
  houseID: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

exports.Room = mongoose.model('Room', schema);
