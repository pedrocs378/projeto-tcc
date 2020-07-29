const Url = require('../models/Url')

const request = require('request')
const rp = require('request-promise')
const cheerio = require('cheerio')

const sites = require('../../sites.json')
const executeCrawler = require('../functions/crawler')

module.exports = {
    async index(req, res) {

        const data = await Url.find({})

        if (data.length > 0) {

            return res.json(data)

        } else {

            throw new Error("Não foi possivel encontrar dados no banco!")
            
        }

    },

    async init(req, res) {

        const data = await Url.find({})

        if (data.length === 0) {
            const dataCreated = await Url.create(sites)
            const urls = dataCreated.map(({ url }) => url)

            executeCrawler(urls, (data) => {
                return res.json(data)
            })

        } else {
            const urls = data.map(({ url }) => url)

            executeCrawler(urls, (data) => {
                return res.json(data)
            })

        }         

    }
}

