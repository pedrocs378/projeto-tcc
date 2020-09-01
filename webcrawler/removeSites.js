const mongoose = require('mongoose')
const Url = require('./src/models/Url')

const uri = require('./src/uri')

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

async function remove() {
    await Url.deleteMany()
}

remove()