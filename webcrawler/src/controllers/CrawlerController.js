const Url = require('../models/Url')

const request = require('request')
const cheerio = require('cheerio')

const sites = require('../../sites.json')
const executeCrawler = require('../crawler/crawler')

module.exports = {
    async index(req, res) {

        const data = await Url.find({})

        if (data.length === 0) {
            const dataCreated = await Url.create(sites)

            return res.json(dataCreated)
        }

        return res.json(data)

    },

    async init(req, res) {

        const data = await Url.find({})
        const response = []

        if (data) {

            for (let i = 0; i < data.length; i++) {
    
                request(data[i].url, (err, res, body) => {
    
                    if (!err) {
    
                        let $ = cheerio.load(body)
    
                        if ($) {
                            if ($('body')) {
                                $('body').find('a').each((key, element) => {
                                    let link = $(element).attr('href')

                                    if (link && (link.split(':')[0] === 'http' || link.split(':')[0] === 'https')) {
                                        if (link.trim().startsWith('/')) {
                                            link = response.href + link.trim()
                                        }

                                        if (link.split('/')[0] === 'undefined') {
                                            if (link.split('/')[1]) {
                                                Url.create({
                                                    title: $("title").text(),
                                                    url: link,
                                                    host: data[i].host,
                                                    desc: data[i].desc
                                                })
                                            }
                                        }

                                        if (!(link.includes('clicklogger'))) {
                                            Url.create({
                                                title: $("title").text(),
                                                url: link,
                                                host: data[i].host,
                                                desc: data[i].desc
                                            })
                                        }

                                        Url.create({
                                            title: $("title").text(),
                                            url: link,
                                            host: data[i].host,
                                            desc: data[i].desc
                                        })
                                    }
                                })
                            }
                        }
    
                    }
                      
                })

                if (i == data.length-1) {
                    
                }

            }

        } else {
            throw new Error("Não foi possivel encontrar dados no banco!")
        }    
        
        return res.json(await Url.find({}))

    }
}

