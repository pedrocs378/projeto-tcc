const express = require('express')

const CrawlerController = require('./controllers/CrawlerController')
const SearchController = require('./controllers/SearchController')

const routes = express.Router()

routes.get('/', CrawlerController.init)
routes.get('/listurls', CrawlerController.index)
routes.get('/search', SearchController.init)

module.exports = routes