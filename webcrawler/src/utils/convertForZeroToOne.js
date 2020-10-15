
/**
 * @param {Array} arrayNumbers
 */
module.exports = function (arrayNumbers) {
    let newArray = new Array(arrayNumbers.length)

    for (let i = 0; i < arrayNumbers.length; i++) {
        const numberStr = String(arrayNumbers[i])
        let denominadorStr = '1'

        for (let i = 0; i < numberStr.length; i++) {
            denominadorStr += '0'
        }

        const denominador = Number(denominadorStr)
        newArray[i] = (arrayNumbers[i] / denominador)
    }

    return newArray

}
// module.exports = function (arrayNumbers) {

//     for (let i = 0; i < arrayNumbers.length; i++) {
//         if (arrayNumbers[i] >= 0 && arrayNumbers[i] < 100) {
//             arrayNumbers[i] = (arrayNumbers[i] / 100)
//         } else if (arrayNumbers[i] >= 100 && arrayNumbers[i] < 1000) {
//             arrayNumbers[i] = (arrayNumbers[i] / 1000)
//         } else if (arrayNumbers[i] >= 1000 && arrayNumbers[i] < 10000) {
//             arrayNumbers[i] = (arrayNumbers[i] / 10000)
//         } else {
//             arrayNumbers[i] = (arrayNumbers[i] / 100000)
//         }
//     }

//     return arrayNumbers

// }