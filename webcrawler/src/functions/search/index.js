

module.exports = function analyseText(textSearched, datas) {

    const textSplited = textSearched.split(' ')
    const dataSearched = []
    const results = []

    let page = 1
    let cont = 0 

    if (textSplited.length > 1) {

        datas.forEach(data => {

            const textInfoParsed = data.textInfo
                .normalize('NFD')
                .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
                .toLowerCase()

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
                const textInfoParsed = data.textInfo
                    .normalize('NFD')
                    .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
                    .toLowerCase()
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