const { Schema, model } = require('mongoose')

const NetworkSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    output: [{
        type: Array,
        required: true
    }],
    weight: [{
        type: Array,
        required: true
    }],
})

module.exports = model('Network', NetworkSchema)