const Url = require('../models/Url')
const Stopword = require('../models/Stopword')

const convertString = require('../utils/convertStringToNumber')
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

            const textSplited = textSearched.split(' ')

            const stopwords = await Stopword.find({})
            const stopwordsParsed = stopwords.map(({ word }) => {
                return word
                    .normalize('NFD')
                    .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
                    .toLowerCase()
            })

            const textWithoutStopwords = textSplited.map((tag) => {
                if (!(stopwordsParsed.includes(tag))) {
                    return {
                        name: tag,
                        value: convertString(tag)
                    }
                } else {
                    return null
                }
            })

            const textWithoutNulls = textWithoutStopwords.filter(el =>
                (el != null) ? (el.name.trim() != "") ? true : false : false)

            const { dataSearched, totalPages, length } = analyzeText(textSplited, textSearched, textWithoutNulls, allDatas, valueTags)
            
            return res.json({ dataSearched, totalPages, length })
        }
        
    }
}
