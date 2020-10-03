const async = require('async')
const Url = require('../models/Url')
const Stopword = require('../models/Stopword')

const convertString = require('../utils/convertStringToNumber')
const { analyseText, executeNetwork } = require('../functions/search')

module.exports = {
    async search(req, res) {
        const { q = "" } = req.query
        const allDatas = await Url.find({})

        const textSearched = q.normalize('NFD')
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            .toLowerCase()

        if (textSearched) {

            const textSplited = textSearched.split(' ')

            async.parallel([
                function (callback) {
                    const { dataSearched, totalPages, length } = analyseText(textSplited, textSearched, allDatas)

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
            ], function(err, results) {

                return res.json({
                    dataSearched: results[0].dataSearched,
                    totalPages: results[0].totalPages,
                    length: results[0].length
                })
            })
        
        }
        
    }
}
