const mongoose = require('mongoose')

const Network = require('./src/models/Network')
const uri = require('./src/uri')

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

async function removeNetworks() {
    await Network.deleteMany()
}

removeNetworks()