var mongoose = require('../lib/mongoose'),
      Schema = mongoose.Schema;

var schema = new Schema({
  userID: {
    type: String,
    required: true
  },
  houseID: {
    type: String,
    required: true
  },
  houseName: {
    type: String
  },
  room: {
    type: Number,
    required: true
  },
  bed: {
    type: Number,
    required: true
  },
  price: {
    type: Number
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  created: {
    type: Date,
    default: Date.now
  }
});

exports.Residence = mongoose.model('Residence', schema);
