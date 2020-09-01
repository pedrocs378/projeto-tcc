const { Schema, model } = require('mongoose')

const StopwordSchema = new Schema({
    word: {
        type: String,
        required: true
    },
})

module.exports = model('Stopword', StopwordSchema)