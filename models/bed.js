var mongoose = require('../lib/mongoose'),
      Schema = mongoose.Schema;

var schema = new Schema({
  num: {
    type: Number
  },
  status: {
    type: Boolean,
    default: false
  },
  created: {
    type: Date,
    default: Date.now
  }
});

exports.Bed = mongoose.model('Bed', schema);
