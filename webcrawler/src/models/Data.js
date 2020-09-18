const { Schema, model } = require('mongoose')

const DataSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    saida: {
        type: Array,
        required: true
    },
    peso: {
        type: Array,
        required: true
    }
})

module.exports = model('Data', DataSchema)