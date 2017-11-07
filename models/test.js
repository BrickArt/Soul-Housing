var mongoose = require('../lib/mongoose'),
      Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String
  },
  address: {
    type: String
  },
  discription: {
    type: String
  },
  rooms: [
    {num: {type:Number}, status: {type: Boolean, default: false}}
  ],
  image: {
    type: String,
  },
  capacity: {
    type: Number,
  },
  created: {
    type: Date,
    default: Date.now
  }
});

exports.Test = mongoose.model('Test', schema);
