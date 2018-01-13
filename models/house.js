

var mongoose = require('../lib/mongoose'),
      Schema = mongoose.Schema;

var schema = new Schema({
  name: {
    type: String
  },
  address: {
    type: String
  },
  description: {
    type: String
  },
  rooms: [
    {
      num: {type:Number},
      beds: [
        {
          num: {type:Number},
          status: {
            type: Boolean,
            default: false
          },
          userID: {type: String}
        }
      ]
    }
  ],
  image: {
    type: String,
  },
  capacity: {
    type: Number,
  },
  freeBeds: {
    type: Number,
  },
  created: {
    type: Date,
    default: Date.now
  }
});

exports.House = mongoose.model('House', schema);
