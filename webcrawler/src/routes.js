const express = require('express')

const crawler = require('./crawler/crawler')
const crawlerTeste = require('./crawler/crawlerTeste')

const search = require('./search/search')

const routes = express.Router()

routes.use('/crawler', crawler.init)
routes.use('/crawlerTeste', crawlerTeste.create)
routes.use('/search', search.init)

module.exports = routes