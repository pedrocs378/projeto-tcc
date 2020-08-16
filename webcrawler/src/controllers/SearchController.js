const Url = require('../models/Url')

module.exports = {
    async search(req, res) {
        const { q = "" } = req.query
        const allDatas = await Url.find({})

        const textSearched = q.normalize('NFD')
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            .toLowerCase()

        if (textSearched) {

            const dataSearched = []
            let page = 1
            let cont = 0 

            allDatas.forEach(data => {

                if (data.tags.includes(textSearched)) {
                    let indexTag = data.tags.indexOf(textSearched)
                    let indexTextInfo = data.textInfo.indexOf(textSearched)
           
                    dataSearched.push({
                        _id: data._id,
                        tags: data.tags[indexTag],
                        title: data.title,
                        url: data.url,
                        host: data.host,
                        textInfo: data.textInfo.substring(indexTextInfo - 100, indexTextInfo + 100),
                        page
                    })

                    if (cont === 9) {
                        page++
                        cont = 0
                    }

                    cont++

                }
            })

            const totalPages = page
            const length = dataSearched.length
            
            return res.json({ dataSearched, totalPages, length })
        }
        
    }
}
