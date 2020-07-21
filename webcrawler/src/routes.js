const express = require('express')

const crawlerController = require('./controllers/CrawlerController')
const searchController = require('./controllers/SearchController')

const routes = express.Router()

routes.use('/crawler', crawlerController.init)
routes.use('/search', searchController.init)

module.exports = routes