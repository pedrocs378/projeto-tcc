
/**
 * @param {Array} arrayNumbers
 */
module.exports = function (arrayNumbers) {

    for (let i = 0; i < arrayNumbers.length; i++) {
        if (arrayNumbers[i] >= 0 && arrayNumbers[i] < 100) {
            arrayNumbers[i] = (arrayNumbers[i] / 100)
        } else if (arrayNumbers[i] >= 100 && arrayNumbers[i] < 1000) {
            arrayNumbers[i] = (arrayNumbers[i] / 1000)
        } else if (arrayNumbers[i] >= 1000 && arrayNumbers[i] < 10000) {
            arrayNumbers[i] = (arrayNumbers[i] / 10000)
        } else {
            arrayNumbers[i] = (arrayNumbers[i] / 100000)
        }
    }

    return arrayNumbers

}