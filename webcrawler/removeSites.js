const mongoose = require('mongoose')
const Url = require('./src/models/Url')

const uri = require('./src/uri')
const sites = require('./sites.json')

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
async function store() {
    const url = await Url.create(sites)
    console.log(url)
}

async function remove() {
    await Url.deleteMany()
}

remove()
// store()