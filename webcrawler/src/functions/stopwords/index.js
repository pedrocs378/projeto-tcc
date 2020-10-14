const fs = require('fs')
const path = require('path')

const { normalizeWord } = require('../../utils/wordUtils')
const Stopword = require('../../models/Stopword')

module.exports = function addStopwords() {
    const stopwords = path.resolve(__dirname, '..', '..', '..', 'files', 'stopwords.txt')
    const stopwords2 = path.resolve(__dirname, '..', '..', '..', 'files', 'stopwords2.txt')

    return new Promise((resolve, reject) => {
        try {
            fs.readFile(stopwords, 'utf8', (err, data) => {
                if (err) {
                    console.log(err)
                }

                const newData = data.split('\n').map(word => { return { word: normalizeWord(word.trim()) } })

                Stopword.create(newData)
                console.log('addStopwords - STOPWORDS 1 INSERIDO')
            })

            fs.readFile(stopwords2, 'utf8', (err, data) => {
                if (err) {
                    console.log(err)
                }

                const newData = data.split(',').map(word => { return { word: normalizeWord(word.trim()) } })

                Stopword.create(newData)
                console.log('addStopwords - STOPWORDS 2 INSERIDO')
            })

            resolve()
        } catch (err) {
            reject(err)
        }
    })
    
    
}