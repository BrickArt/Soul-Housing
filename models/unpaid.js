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
    count: {
        type: Number,
        default: 0
    },
    timeout:{
        type: String,
        default: null
    },
    created: {
        type: Date,
        default: Date.now
    }
});

exports.Unpaid = mongoose.model('Unpaid', schema);
