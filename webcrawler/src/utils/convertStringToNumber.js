
/**
 * @param {String} word
 */
module.exports = function(word) {
    const aux = word.trim()
    let response = 0

    for (let i in aux) {
        response += aux[i].toLowerCase().charCodeAt()
    }

    return response
}