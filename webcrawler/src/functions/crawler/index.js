const Url = require('../../models/Url')

const rp = require('request-promise')
const cheerio = require('cheerio')

const data = []

module.exports = function executeCrawler(urls, callback) {

    let i = 0

    function next() {
        if (i < urls.length) {
            let options = {
                uri: urls[i],
                transform: body => cheerio.load(body)
            }

            rp(options)
                .then($ => {

                    const urls = []

                    if ($) {

                        if ($('body')) {
                            $('body').find('a').each((key, element) => {
                                let link = $(element).attr('href')

                                urls.push(link)
                            })
                        }
                    }
                    return urls
                })
                .then(urls => {
                    const newUrls = []

                    urls.forEach(url => {
                        if (url && (url.split(':')[0] === 'http' || url.split(':')[0] === 'https')) {
                            newUrls.push(url)
                        }
                    })

                    return newUrls

                })
                .then((urls) => {
                    urls.map(url => data.push(url))

                    ++i

                    return next()
                })
        } else {
            console.log(data)

            callback(data)
        }
    }

    return next()

}
