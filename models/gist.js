var mongoose = require('../lib/mongoose'),
      Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String,
    required: true,
    default: null
  },
  lastname: {
    type: String,
    required: true,
    default: null
  },
  dateOfBirth: {
    type: String,
    default: null
  },
  gender: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  program: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  balance: {
    type: Number,
    default: 0
  },
  image:{
    type: String,
    default: null
  },
  status: {
    type: Boolean,
    default: false
  },
  residence: {
    type: String,
    default: null
  },
  created: {
    type: Date,
    default: Date.now
  }
});

exports.Gist = mongoose.model('Gist', schema);
