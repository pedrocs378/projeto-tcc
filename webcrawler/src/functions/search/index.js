const Url = require('../../models/Url')

const rp = require('request-promise')
const cheerio = require('cheerio')

const results = []

module.exports = async function handleMakeSearch(words, callback) {
    let i = 0

    const data = await Url.find({})

    async function next() {
        if(data.length > 0) {
            if (i < data.length) {

                let options = {
                    uri: data[i].url,
                    transform: (body, res) => cheerio.load(body)
                }

                rp(options)
                    .then($ => {
                        const arrWords = []

                        if ($) {

                            if ($('body')) {
                                handleSearchTags($, 'body', 'p', words, data[i].url)
                                // handleSearchTags($, 'body', 'div p', arrWords)
                                // handleSearchTags($, 'body', 'div h1', arrWords)
                                // handleSearchTags($, 'body', 'div h2', arrWords)
                                // handleSearchTags($, 'body', 'li p', arrWords)
                                // handleSearchTags($, 'body', 'li', arrWords)
                                // handleSearchTags($, 'body', 'ul li em', arrWords)
                            }

                        }
                        return arrWords
                    })
                    .then((arrWords) => {

                        ++i

                        next()
                    })

            } else {

                callback(results)

            }
        }
    }

    return next()
}


function handleSearchTags($, strTag = '', strTagLink = '', qryWords, url) {
    console.log(url)

    $(strTag).find(strTagLink).each((i, element) => {

        let text = $(element).text()
        let textArray = text.split(' ')

        if (text) {
            for (let w = 0; w < textArray.length; w++) {
                if (textArray[w] == qryWords) {
                    results.push({
                        url,
                        text
                    })
                    console.log("Encontrado - " + text)
                    break
                }
            }

        }

    })

}