const { Schema, model } = require('mongoose')

const UrlSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    textInfo: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    }
})

module.exports = model('Url', UrlSchema)