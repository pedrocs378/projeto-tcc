const Network = require('../../models/Network')

const { convertStringToNumber, normalizeWord } = require('../../utils/wordUtils')

/**
 * @param {Array} valueTags
 */
function analyseText(textSplited, textSearched, datas, stopwords) {


    const dataText = textSplited
        .map((tag) => {
            if (!(stopwords.includes(tag))) {
                return {
                    name: tag,
                    value: convertStringToNumber(tag)
                }
            } else {
                return null
            }
        })
        .filter(el =>
            (el != null) ? (el.name.trim() != "") ? true : false : false)

    const inputText = dataText
        .map(data => data.name)
        .join(' ')

    Network
        .findOne({ input: inputText })
        .then(input => {
            // if (input) {

            //     const dataSearch = input.dataSearch

            //     dataSearch.forEach(data => {
            //         console.log(data.pageId)
            //     })
            // }
        })

    let page = 1
    let cont = 0

    const dataSearched = []

    if (textSplited.length > 1) {

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
                    textInfo: data.textInfo.substring(indexTextInfo - 100, indexTextInfo + 100) + ' ...',
                    page
                })

                if (cont === 9) {
                    page++
                    cont = 0
                }

                cont++
            }

        })
    } else {
        datas.forEach(data => {
            const tagsWithoutStopwords = data.tagsWithoutStopwords
            const tags = tagsWithoutStopwords.map(tag => tag.name)

            if (tags.includes(textSearched)) {
                const indexTag = data.tags.indexOf(textSearched)
                const textInfoParsed = normalizeWord(data.textInfo)
                const indexTextInfo = textInfoParsed.indexOf(textSearched)

                dataSearched.push({
                    _id: data._id,
                    tags: textSplited,
                    title: data.title,
                    url: data.url,
                    host: data.host,
                    textInfo: data.textInfo.substring(indexTextInfo - 100, indexTextInfo + 100) + ' ...',
                    page
                })

                cont++

                if (cont >= 10) {
                    page++
                    cont = 0
                }

            }

        })   
    }

    const totalPages = cont === 0 ? page - 1 : page
    const length = dataSearched.length

    return { dataSearched, totalPages, length }

}

module.exports = { analyseText }