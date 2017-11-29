var mongoose = require('../lib/mongoose'),
Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    }
});

exports.Type = mongoose.model('Type', schema);