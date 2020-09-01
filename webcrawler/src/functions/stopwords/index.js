const fs = require('fs')
const path = require('path')

const Stopword = require('../../models/Stopword')

module.exports = async function addStopwords() {
    const stopwords = path.resolve(__dirname, '..', '..', '..', 'files', 'stopwords.txt')
    const stopwords2 = path.resolve(__dirname, '..', '..', '..', 'files', 'stopwords2.txt')

    fs.readFile(stopwords, 'utf8', async (err, data) => {
        if (err) {
            console.log(err)
        }

        const newData = data.split('\n').map(data => { return { word: data.trim() } })

        await Stopword.create(newData)
        console.log('addStopwords - STOPWORDS 1 INSERIDO')
    })

    fs.readFile(stopwords2, 'utf8', async (err, data) => {
        if (err) {
            console.log(err)
        }

        const newData = data.split(',').map(data => { return { word: data.trim() } })

        await Stopword.create(newData)
        console.log('addStopwords - STOPWORDS 2 INSERIDO')
    })
}