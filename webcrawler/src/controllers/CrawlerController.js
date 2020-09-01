const Url = require('../models/Url')
const Stopword = require('../models/Stopword')

const puppeteer = require('puppeteer')

const sites = require('../../sites.json')
const handleRunCrawler = require('../functions/crawler')
const addStopwords = require('../functions/stopwords')

module.exports = {
    async index(req, res) {

        const datas = await Url.find({})

        if (datas.length > 0) {
            let pages = 1
            let cont = 0 

            const dataPaginated = datas.map(({ _id, title, url, host, textInfo, tags }) => {
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
                    textInfo,
                    tags,
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
        const stopwords = await Stopword.find({})

        if (stopwords.length === 0 ) {
            console.log('addStopwords - INSERINDO STOPWORDS...')
            addStopwords()
        }

        const browser = await puppeteer.launch();
        console.log('Puppeteer - BROWSER INICIADO')

        const page = await browser.newPage();
        console.log('Puppeteer - NOVA PAGINA CRIADA')

        if (data.length === 0) {
            const dataCreated = await Url.create(sites)
            const urls = dataCreated.map(({ url }) => url)

            console.log('handleRunCrawler - INICIANDO CRAWLER...')
            handleRunCrawler(page, urls, async (savedData) => {
                await browser.close()
                console.log('Puppeteer - BROWSER FECHADO')

                console.log('handleRunCrawler - CRAWLER FINALIZADO')
                return res.status(200).send()
            })

        } else {
            const urls = data.map(({ url }) => url)

            console.log('handleRunCrawler - INICIANDO CRAWLER...')
            handleRunCrawler(page, urls, async (savedData) => {
                await browser.close()
                console.log('Puppeteer - BROWSER FECHADO')

                console.log('handleRunCrawler - CRAWLER FINALIZADO')
                return res.status(200).send()
            })

        }         

    }
}

