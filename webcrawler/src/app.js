const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const { errors } = require('celebrate')

const routes = require('./routes')
const uri = require('./uri.js')

const app = express()

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// app.use(cors())
app.use(express.json())
app.use(routes)
app.use(errors())
 
app.listen(3333)