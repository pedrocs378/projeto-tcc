const Url = require('../../models/Url')

const Crawler = require("crawler");
const rp = require('request-promise')
const cheerio = require('cheerio')

const data = []

module.exports = function handleRunCrawler(dataUrl, callback) {

    let i = 0
    let interval

    async function next() {
        if (i < dataUrl.length) {
            let options = {
                uri: dataUrl[i],
                transform: (body, res) => cheerio.load(body) 
            }

            rp(options)
                .then($ => {

                    const urls = []

                    if ($) {
                        handleSearchTags($, '.list-group', 'a.list-group-item', urls)
                    }
                    return urls
                })
                .then(urls => {

                    const newUrls = []

                    urls.forEach(({ title, link }) => {
                        if (link && (link.split(':')[0] === 'http' || link.split(':')[0] === 'https')) {
                            newUrls.push({ title, link })
                        }
                    })

                    return newUrls

                })
                .then((urls) => {

                    handleSaveData(urls).then(() => {
                        ++i

                        return next()

                    })


                })
            
        } else {
            callback(data)
        }
    }

    return next()

}

function handleSearchTags($, strTag = '', strTagLink = '', arrUrls) {

    if ($(strTag)) {
        $(strTag).find(strTagLink).each((key, element) => {
            let title = $(element).find('strong').text()
            let link = $(element).attr('href')

            urls.push({ title, link })
        })
    }

}

function handleSaveData(urlData) {
    let i = 0

    return new Promise((resolve, reject) => {

        async function next() {
            if (i < urlData.length) {
                const dataExist = await Url.find({ url: urlData[i].link })
                if (dataExist.length === 0) {
                    data.push(await Url.create({
                        title: urlData[i].title,
                        url: urlData[i].link,
                        host: urlData[i].link.split('/')[2],
                        desc: 'Descrição'
                    }))
                }

                ++i

                next()
            } else {
                resolve(data)
            }
        }

        next()

    })

}
