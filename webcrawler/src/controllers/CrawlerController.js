const Url = require('../models/Url')

const sites = require('../../sites.json')
const executeCrawler = require('../crawler/crawler')

module.exports = {
    async init(req, res) {

        const urls = await Url.find({})
        let data = []

        if (!urls) {
            const newUrls = await Url.create(sites)

            executeCrawler(newUrls)
        }

        executeCrawler(urls)

        return res.json(urls)
    }
}

