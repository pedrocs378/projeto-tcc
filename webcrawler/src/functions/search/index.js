const Network = require('../../models/Network')
const Url = require('../../models/Url')

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

    let contPages = 1
    let cont = 0

    const dataSearched = []

    Network
        .findOne({ input: inputText })
        .then(input => {

            if (input) {

                async function findPages(dataSearch) {
                    const pages = []
                    for (let i = 0; i < dataSearch.length; i++) {
                        const page = await Url.findById(dataSearch[i].pageId)

                        pages.push(page)
                    }

                    return pages
                }

                const dataSearch = input.dataSearch

                const pages = findPages(dataSearch)

                return { pages, found: true }
            } else {
                console.log('NADA ENCONTRADO')

                return { pages: datas, found: false }
            }

        })
        // .then(({ pages, found }) => {

        //     async function returnPages(pages, found) {
        //         if (found) {
        //             pages.forEach(page => {
        //                 dataSearched.push({
        //                     _id: page._id,
        //                     tags: textSplited,
        //                     title: page.title,
        //                     url: page.url,
        //                     host: page.host,
        //                     textInfo: page.textInfo.substring(0, 200) + ' ...',
        //                     page: contPages
        //                 })
        
        //                 if (cont === 9) {
        //                     contPages++
        //                     cont = 0
        //                 }
        
        //                 cont++   
        //             })
        //         } else {
        //             pages.forEach(page => {
    
        //                 const textInfoParsed = normalizeWord(page.textInfo)
    
        //                 if (textInfoParsed.includes(textSearched)) {
        //                     const indexTextInfo = textInfoParsed.indexOf(textSearched)
    
        //                     dataSearched.push({
        //                         _id: page._id,
        //                         tags: textSplited,
        //                         title: page.title,
        //                         url: page.url,
        //                         host: page.host,
        //                         textInfo: page.textInfo.substring(indexTextInfo - 100, indexTextInfo + 100) + ' ...',
        //                         page: contPages
        //                     })
    
        //                     if (cont === 9) {
        //                         contPages++
        //                         cont = 0
        //                     }
    
        //                     cont++
        //                 }
    
        //             })
        //         }

        //         return dataSearched
        //     }

        //     return returnPages(pages, found)

        // })

    const totalPages = cont === 0 ? contPages - 1 : contPages
    const length = dataSearched.length

    return { dataSearched, totalPages, length }

    // if (textSplited.length > 1) {

    //     datas.forEach(data => {

    //         const textInfoParsed = normalizeWord(data.textInfo)

    //         if (textInfoParsed.includes(textSearched)) {
    //             const indexTextInfo = textInfoParsed.indexOf(textSearched)

    //             dataSearched.push({
    //                 _id: data._id,
    //                 tags: textSplited,
    //                 title: data.title,
    //                 url: data.url,
    //                 host: data.host,
    //                 textInfo: data.textInfo.substring(indexTextInfo - 100, indexTextInfo + 100) + ' ...',
    //                 page: contPages
    //             })

    //             if (cont === 9) {
    //                 contPages++
    //                 cont = 0
    //             }

    //             cont++
    //         }

    //     })
    // } else {
    //     datas.forEach(data => {
    //         const tagsWithoutStopwords = data.tagsWithoutStopwords
    //         const tags = tagsWithoutStopwords.map(tag => tag.name)

    //         if (tags.includes(textSearched)) {
    //             const indexTag = data.tags.indexOf(textSearched)
    //             const textInfoParsed = normalizeWord(data.textInfo)
    //             const indexTextInfo = textInfoParsed.indexOf(textSearched)

    //             dataSearched.push({
    //                 _id: data._id,
    //                 tags: textSplited,
    //                 title: data.title,
    //                 url: data.url,
    //                 host: data.host,
    //                 textInfo: data.textInfo.substring(indexTextInfo - 100, indexTextInfo + 100) + ' ...',
    //                 page: contPages
    //             })

    //             cont++

    //             if (cont >= 10) {
    //                 contPages++
    //                 cont = 0
    //             }

    //         }

    //     })   
    // }

}

module.exports = { analyseText }