const Url = require('../../models/Url')

const rp = require('request-promise')
const cheerio = require('cheerio')

const data = []

module.exports = function executeCrawler(urls, callback) {

    let i = 0

    async function next() {
        if (i < urls.length) {
            let options = {
                uri: urls[i],
                transform: (body, res) => cheerio.load(body) 
            }

            rp(options)
                .then($ => {

                    const urls = []

                    if ($) {

                        if ($('body')) {
                            handleSearchTags($, 'body', 'a', urls)
                            handleSearchTags($, 'body', 'div a', urls)
                            handleSearchTags($, 'body', 'li a', urls)
                            handleSearchTags($, 'body', 'ul > li a', urls)
                        }

                    }
                    return urls
                })
                .then(urls => {
                    const newUrls = []

                    urls.forEach(({ title, link }) => {
                        if(link && (link.split(':')[0] === 'http' || link.split(':')[0] === 'https')) {                       
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

    $(strTag).find(strTagLink).each((key, element) => {
        let titleAux = $('head').find('title').text()
        let title = $(element).attr('title') ? $(element).attr('title') : titleAux
        let link = $(element).attr('href')

        arrUrls.push({ title, link })
    })

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
