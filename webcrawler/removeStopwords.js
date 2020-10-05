const mongoose = require('mongoose')

const Stopword = require('./src/models/Stopword')
const uri = require('./src/uri')

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

async function removeStopwords() {
    await Stopword.deleteMany()
}

removeStopwords()