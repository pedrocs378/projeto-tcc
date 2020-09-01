const express = require('express')

const CrawlerController = require('./controllers/CrawlerController')
const SearchController = require('./controllers/SearchController')

const neuralNetwork = require('./neuralNetwork')

const routes = express.Router()

routes.post('/crawler', CrawlerController.init)
routes.get('/search', SearchController.search)

routes.get('/neuralNetwork', neuralNetwork)

module.exports = routes