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
            const dataSearched = []

            const existsInput = await Network.findOne({ input: inputText })

            if (existsInput) {
                // console.log('search - TERMO ENCONTRADO NA REDE... FAZENDO AJUSTES')
                let contPages = 1
                let cont = 0

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

                    dataSearched.push({
                        _id: page._id,
                        tags: textSplited,
                        title: page.title,
                        url: page.url,
                        host: page.host,
                        textInfo: setDescription(page.textInfo, inputText, dataSorted[i].indexComumTag),
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

                return res.json({
                    dataSearched,
                    totalPages,
                    length
                })
                
            } else {
                const datas = await Url.find({})

                await executeNetwork(datas, textSplited, stopwords)

                const dataNetwork = await Network.findOne({ input: inputText })
                
                let contPages = 1
                let cont = 0

                const dataSearch = dataNetwork.dataSearch
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

                    dataSearched.push({
                        _id: page._id,
                        tags: textSplited,
                        title: page.title,
                        url: page.url,
                        host: page.host,
                        textInfo: setDescription(page.textInfo, inputText, dataSorted[i].indexComumTag),
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

                return res.json({
                    dataSearched,
                    totalPages,
                    length
                })
            }
        
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
