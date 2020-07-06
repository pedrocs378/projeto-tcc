let firebase = require('firebase/app')
let sites = require('./sites.json')
require('firebase/database')

const firebaseConfig = require('./src/firebaseConfig')

firebase.initializeApp(firebaseConfig)
firebase.database().ref('sites/').remove()