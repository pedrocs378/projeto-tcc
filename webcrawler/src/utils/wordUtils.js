const convertForZeroToOne = require("./convertForZeroToOne")

function normalizeWord(word) {

    return word
        .normalize('NFD')
        .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
        .replace(/[,?!.-]/g, '')
        .toLowerCase()
}

function convertStringToNumber(word) {
    const aux = word.trim()
    let response = 0
    let arrTest = []

    for (let i in aux) {
        response += aux[i].toLowerCase().charCodeAt()
        arrTest.push(aux[i].toLowerCase().charCodeAt())
    }

    console.log('STRING CONVERTIDA PARA ARRAY:', arrTest)
    console.log('STRING CONVERTIDA PARA ARRAY (0-1):', convertForZeroToOne(arrTest))

    return response
}

module.exports = { normalizeWord, convertStringToNumber }