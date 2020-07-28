const Url = require('../../models/Url')

const rp = require('request-promise')
const cheerio = require('cheerio')
const { parseHTML } = require('cheerio')

const data = []

module.exports = function executeCrawler(urls, callback) {

    let i = 0

    async function next() {
        if (i < urls.length) {
            let options = {
                uri: urls[i],
                json: true,
                transform: (body, res) => cheerio.load(body) 
            }

            rp(options)
                .then($ => {

                    const urls = []

                    if ($) {

                        if ($('body')) {
                            $('body').find('a').each((key, element) => {
                                let titleAux = $('head').find('title').text()
                                let title = $(element).attr('title') ? $(element).attr('title') : titleAux
                                let link = $(element).attr('href')

                                urls.push({title, link})
                            })
                        }

                    }
                    return urls
                })
                .then(urls => {
                    const newUrls = []

                    urls.forEach(({ title, link }) => {
                        if(link && (link.split(':')[0] === 'http' || link.split(':')[0] === 'https')) {
                            newUrls.push({ title, link})
                        }
                    })

                    return newUrls

                })
                .then((urls) => {

                    urls.map(({ title, link }) => {
                        data.push({
                            title,
                            url: link,
                            host: link.split('/')[2],
                            desc: 'Descrição'
                        })
                    })
                    ++i

                    return next()
                })
        } else {
            const savedData = await Url.create(data)

            callback(savedData)
        }
    }

    return next()

}
