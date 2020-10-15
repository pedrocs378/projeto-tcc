const async = require('async')

const Url = require('../models/Url')
const Stopword = require('../models/Stopword')
const Network = require('../models/Network')

const { normalizeWord } = require('../utils/wordUtils')
const executeNetwork = require('../functions/neuralNetwork/executeNetwork')


module.exports = {
    async search(req, res) {
        const { q = "" } = req.query
        console.log('search - INICIANDO PESQUISA DO TERMO:', q)

        const stopwordsData = await Stopword.find({})
        const stopwords = stopwordsData.map(data => data.word)

        const textSearched = normalizeWord(q)

        if (textSearched) {

            const textSplited = textSearched.split(' ')

            const dataText = textSplited
                .filter((tag) => {
                    if (!(stopwords.includes(tag))) {
                        return true
                    }
                })
                
            const inputText = dataText.join(' ')

            const pages = []
            const existsInput = await Network.findOne({ input: inputText })

            if (existsInput) {
                console.log('search - TERMO ENCONTRADO NA REDE... FAZENDO AJUSTES')

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
                        indexComumTag: dataSorted[i].indexComumTag,
                        totalTags: dataSorted[i].totalTags
                    })
                }
                
            }

            async.parallel([
                function (callback) {
                    console.log('search:executeNetwork - EXECUTANDO REDE.....')

                    Url.find({})
                        .then(datas => {

                            executeNetwork(datas, textSplited, stopwords)

                            callback()
                        })
                },
                function (callback) {
                                                   
                    let contPages = 1
                    let cont = 0

                    const dataSearched = []

                    if (existsInput) {
                        console.log('search:return - INSERINDO DADOS DO RETORNO DA REDE')

                        for (let i = 0; i < pages.length; i++) {
                            console.log(pages[i].totalTags)
                            dataSearched.push({
                                _id: pages[i]._id,
                                tags: textSplited,
                                title: pages[i].title,
                                url: pages[i].url,
                                host: pages[i].host,
                                textInfo: setDescription(pages[i].textInfo, inputText, pages[i].indexComumTag),
                                page: contPages
                            })

                            if (cont === 9) {
                                contPages++
                                cont = 0
                            }

                            cont++ 
                        }

                        const totalPages = cont === 0 ? contPages - 1 : contPages
                        const length = dataSearched.length

                        callback(null, {
                            dataSearched,
                            totalPages,
                            length
                        })
                    } else {
                        console.log('search:return - TERMO NAO ENCONTRADO... PROCURANDO NA BASE DE DADOS')

                        Url.find({})
                            .then(datas => {
                                datas.forEach(data => {
                                    const textInfoParsed = normalizeWord(data.textInfo)

                                    if (textInfoParsed.includes(textSearched)) {
                                        const indexTextInfo = textInfoParsed.indexOf(textSearched)

                                        dataSearched.push({
                                            _id: data._id,
                                            tags: textSplited,
                                            title: data.title,
                                            url: data.url,
                                            host: data.host,
                                            textInfo: setDescription(data.textInfo, inputText, null),
                                            page: contPages
                                        })

                                        if (cont === 9) {
                                            contPages++
                                            cont = 0
                                        }

                                        cont++
                                    }

                                })

                                const totalPages = cont === 0 ? contPages - 1 : contPages
                                const length = dataSearched.length

                                callback(null, {
                                    dataSearched,
                                    totalPages,
                                    length
                                })
                            })

                    }

                }
            ], function(_, results) {

                console.log('search:return - RETORNANDO DADOS')
                return res.json({
                    dataSearched: results[1].dataSearched,
                    totalPages: results[1].totalPages,
                    length: results[1].length
                })
            })
        
        }
        
    }
}

/**
 * @param {String} textInfo
 */
function setDescription(textInfo, inputText, indexTag) {
    let stringSearch = ""

    if (indexTag) {
        const inputArray = inputText.split(' ')
        stringSearch = inputArray[indexTag]
    } else {
        stringSearch = inputText     
    }

    const regex = new RegExp(`${stringSearch}`, 'i')
    const index = textInfo.search(regex)

    let newStart = 0
    for (let i = index - 20; i > 0; i--) {
        if (isUpperCase(textInfo[i])) {
            newStart = i
            break
        }
    }

    newStart = newStart <= 0 ? index - 20 : newStart

    const newDescription = textInfo.substring(newStart, index + 200) + ' ...'

    return newDescription

}

function isUpperCase(str) {
    return str !== str.toLowerCase();
}
