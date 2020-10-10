const async = require('async')

const Url = require('../models/Url')
const Stopword = require('../models/Stopword')
const Network = require('../models/Network')

const { normalizeWord } = require('../utils/wordUtils')
const executeNetwork = require('../functions/neuralNetwork/executeNetwork')


module.exports = {
    async search(req, res) {
        const { q = "" } = req.query
        const allDatas = await Url.find({})

        const stopwords = await Stopword.find({})
        const stopwordsParsed = stopwords
            .map(({ word }) => normalizeWord(word))

        const textSearched = normalizeWord(q)

        if (textSearched) {

            const textSplited = textSearched.split(' ')

            const dataText = textSplited
                .filter((tag) => {
                    if (!(stopwordsParsed.includes(tag))) {
                        return true
                    }
                })
                
            const inputText = dataText.join(' ')

            let found = false
            const pages = []
            const existsInput = await Network.findOne({ input: inputText })

            if (existsInput) {
                const dataSearch = existsInput.dataSearch 
                const dataSorted = dataSearch
                    .map(data => {
                        let totalTags = 0

                        for (let i = 0; i < data.tagsPerPage.length; i++) {
                            totalTags += data.tagsPerPage[i]
                        }

                        return {
                            totalTags,
                            indexComumTag: data.tagsPerPage.indexOf(Math.max(...data.tagsPerPage)),
                            pageId: data.pageId
                        }
                    })
                    .sort((a, b) => b.totalTags - a.totalTags)
                
                for (let i = 0; i < dataSorted.length; i++) {
                    const page = await Url.findById(dataSorted[i].pageId)

                    pages.push({
                        _id: page._id,
                        title: page.title,
                        url: page.url,
                        host: page.host,
                        textInfo: page.textInfo,
                        indexComumTag: dataSorted[i].indexComumTag
                    })
                }  
                
                found = true
            }

            async.parallel([
                function (callback) {
                                                   
                    let contPages = 1
                    let cont = 0

                    const dataSearched = []

                    if (found) {
                        pages.forEach(page => {
                            dataSearched.push({
                                _id: page._id,
                                tags: textSplited,
                                title: page.title,
                                url: page.url,
                                host: page.host,
                                textInfo: setDescription(page.textInfo, inputText, page.indexComumTag),
                                page: contPages
                            })

                            if (cont === 9) {
                                contPages++
                                cont = 0
                            }

                            cont++   
                        })
                    } else {

                        allDatas.forEach(data => {
                            const textInfoParsed = normalizeWord(data.textInfo)

                            if (textInfoParsed.includes(textSearched)) {
                                const indexTextInfo = textInfoParsed.indexOf(textSearched)

                                dataSearched.push({
                                    _id: data._id,
                                    tags: textSplited,
                                    title: data.title,
                                    url: data.url,
                                    host: data.host,
                                    textInfo: data.textInfo.substring(indexTextInfo - 100, indexTextInfo + 100) + ' ...',
                                    page: contPages
                                })

                                if (cont === 9) {
                                    contPages++
                                    cont = 0
                                }

                                cont++
                            }

                        })
                    }
                    const totalPages = cont === 0 ? contPages - 1 : contPages
                    const length = dataSearched.length

                    callback(null, {
                        dataSearched,
                        totalPages,
                        length
                    })

                },
                function(callback) {
                    console.log('EXECUTANDO REDE.....')
                    executeNetwork(allDatas, textSplited)

                    callback()
                }
            ], function(_, results) {

                return res.json({
                    dataSearched: results[0].dataSearched,
                    totalPages: results[0].totalPages,
                    length: results[0].length
                })
            })
        
        }
        
    }
}

/**
 * @param {String} textInfo
 */
function setDescription(textInfo, inputText, indexTag) {
    const inputArray = inputText.split(' ')
    const stringSearch = inputArray[indexTag]
    const regex = new RegExp(`${stringSearch}`, 'i')
    const index = textInfo.search(regex)

    let newStart = 0
    for (let i = index-20; i > 0; i--) {
        if (isUpperCase(textInfo[i])) {
            newStart = i
            break
        }
    }

    newStart = newStart <= 0 ? index-20 : newStart

    const newDescription = textInfo.substring(newStart, index+200) + ' ...'

    return newDescription

}

function isUpperCase(str) {
    return str !== str.toLowerCase();
}
