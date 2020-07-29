const express = require('express')

const CrawlerController = require('./controllers/CrawlerController')
const SearchController = require('./controllers/SearchController')

const routes = express.Router()

routes.get('/', CrawlerController.init)
routes.get('/list', CrawlerController.index)
routes.get('/search', SearchController.search)

module.exports = routes