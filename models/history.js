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
  room: {
    type: Number,
    required: true
  },
  bed: {
    type: Number,
    required: true
  },
  prise: {
    type: String
  },
  discription: {
    type: String
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
