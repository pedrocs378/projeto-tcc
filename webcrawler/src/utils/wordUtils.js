

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

    for (let i in aux) {
        response += aux[i].toLowerCase().charCodeAt()
    }

    return response
}

module.exports = { normalizeWord, convertStringToNumber }