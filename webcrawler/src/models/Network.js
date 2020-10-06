const { Schema, model } = require('mongoose')

const ObjectId = Schema.Types.ObjectId

const NetworkSchema = new Schema({
    input: {
        type: String,
        required: true
    },
    dataSearch: [{
        pageId: {
            type: ObjectId,
            required: true
        },
        wBD: {
            type: Array,
            required: true
        },
    }]
    
})

module.exports = model('Network', NetworkSchema)