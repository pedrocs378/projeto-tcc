const express = require('express')
const cors = require('cors')
const { errors } = require('celebrate')
const routes = require('./routes')

const firebase = require('firebase/app')
const firebaseConfig = require('./firebaseConfig')
require('firebase/database')

const app = express()

firebase.initializeApp(firebaseConfig)

app.use(cors())
app.use(express.json())
app.use(routes)
app.use(errors())
 
app.listen(3333)