var mongoose = require('../lib/mongoose'),
      Schema = mongoose.Schema;

var schema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  sum: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: null
  },
  program: {
    type: String,
    default: null
  },
  image: {
    type: String
  },
  userID: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: null
  },
  created: {
    type: Date,
    default: Date.now
  }
});

exports.Payment = mongoose.model('Payment', schema);
