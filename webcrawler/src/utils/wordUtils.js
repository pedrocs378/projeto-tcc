function normalizeWord(word) {

    return word
        .normalize('NFD')
        .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
        .replace(/[,?!.-]/g, '')
        .toLowerCase()
}

function convertStringToNumber(word) {
    const alphabet = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 
        'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 
        's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', 
        '1', '2', '3', '4', '5', '6', '9', '8', '9'
    ]
    let numberStr = ''

    for (let i = 0; i < word.length; i++) {
        let index = alphabet.indexOf(word[i].toLowerCase())

        numberStr += String(index + 1)
    }

    return numberStr
}

// function convertStringToNumber(word) {
//     const aux = word.trim()
//     let response = 0

//     for (let i in aux) {
//         response += aux[i].toLowerCase().charCodeAt()
//     }

//     return response
// }

module.exports = { normalizeWord, convertStringToNumber }