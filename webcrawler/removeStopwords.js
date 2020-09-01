const mongoose = require('mongoose')

const Stopword = require('./src/models/Stopword')
const uri = require('./src/uri')

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

async function addStopwords() {
    await Stopword.deleteMany()
}

addStopwords()