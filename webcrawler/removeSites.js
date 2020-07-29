const mongoose = require('mongoose')
const Url = require('./src/models/Url')

const sites = require('./sites.json')

mongoose.connect('mongodb+srv://pedrocs378:pedro741852@cluster0.tkqge.gcp.mongodb.net/webcrawler?retryWrites=true&w=majority', {
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