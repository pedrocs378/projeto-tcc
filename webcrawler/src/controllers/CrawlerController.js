const Url = require('../models/Url')

const puppeteer = require('puppeteer')

const sites = require('../../sites.json')
const handleRunCrawler = require('../functions/crawler')

module.exports = {
    async index(req, res) {

        const datas = await Url.find({})

        if (datas.length > 0) {
            let pages = 1
            let cont = 0

            const dataPaginated = datas.map(({ _id, title, url, host, desc }) => {
                cont++

                if (cont === 9) {
                    pages++
                    cont = 0
                }

                return {
                    _id,
                    title,
                    url,
                    host,
                    desc,
                    pages
                }           
            })

            return res.json({dataPaginated, pages})

        } else {

            throw new Error("Não foi possivel encontrar dados no banco!")
            
        }

    },

    async init(req, res) {

        const data = await Url.find({})

        if (data.length === 0) {
            const dataCreated = await Url.create(sites)
            const urls = dataCreated.map(({ url }) => url)

            handleRunCrawler(urls, (savedData) => {
                return res.json(savedData)
            })

        } else {
            const urls = data.map(({ url }) => url)

            handleRunCrawler(urls, (savedData) => {
                return res.json(savedData)
            })

        }         

    }
}

