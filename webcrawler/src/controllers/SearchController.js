const Url = require('../models/Url')

const analyzeText = require('../functions/search')

module.exports = {
    async search(req, res) {
        const { q = "" } = req.query
        const allDatas = await Url.find({})
        const tagsWithoutStopwords = await Url.find({}, '-_id tagsWithoutStopwords.value')
        const tags = tagsWithoutStopwords.map(tag => tag.tagsWithoutStopwords)
	    const valueTags = tags.map((tag) => { return tag.map(({ value }) => value) })

        const textSearched = q.normalize('NFD')
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            .toLowerCase()

        if (textSearched) {

            const { dataSearched, totalPages, length } = analyzeText(textSearched, allDatas, valueTags)
            
            return res.json({ dataSearched, totalPages, length })
        }
        
    }
}
