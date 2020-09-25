const NetworkController = require('../neuralNetwork')

const { 
    alpha, 
    beta, 
    pA, 
    pAB,
    pB, 
    pD, 
    phase 
} = require('../../configs/networkConfig')
const convertNumber = require('../../utils/convertForZeroToOne')

/**
 * @param {Array} valueTags
 */
module.exports = function analyseText(textSplited, textSearched, dataText, datas, valueTags) {

    let page = 1
    let cont = 0

    const valuesText = dataText.map(data => data.value)
    const valuesNormalized = convertNumber(valuesText)

    const dataSearched = []

    valueTags.forEach((values, index) => {
        console.log('\n\nURL ACESSADA:', datas[index].url)
        const neuralNetwork = new NetworkController(pA, pB, pAB, pD, alpha, beta, phase)

        // SET INPUTS
        neuralNetwork.setInputValues(valuesNormalized, valuesNormalized.length, 1)
        let inputNetwork = neuralNetwork.getInputValues
        console.log('INPUT:\n', inputNetwork)

        let input = neuralNetwork.realizaComplemento(inputNetwork, inputNetwork.length, inputNetwork[0].length)
        neuralNetwork.complementA = input
        console.log('COMPL. INPUT:\n', neuralNetwork.complementA)

        let wInput = neuralNetwork.inicializaValores(neuralNetwork.complementA.length, neuralNetwork.complementA[0].length, 1)
        neuralNetwork.weightInput = wInput
        console.log('WEIGHT INPUT:\n', neuralNetwork.weightInput)

        // SET OUTPUTS
        const valueTagsNormalized = convertNumber(values)
        valueTagsNormalized.includes()
        neuralNetwork.setOutputValues(valueTagsNormalized, valuesNormalized.length, valueTagsNormalized.length)
        let outputNetwork = neuralNetwork.getOutputValues
        console.log('OUTPUT:\n', outputNetwork)

        let output = neuralNetwork.realizaComplemento(outputNetwork, outputNetwork.length, outputNetwork[0].length)
        neuralNetwork.complementB = output
        console.log('COMPL. OUTPUT:\n', neuralNetwork.complementB)

        let wOutput = neuralNetwork.inicializaValores(neuralNetwork.complementB.length, neuralNetwork.complementB[0].length, 1)
        neuralNetwork.weightOutput = wOutput
        console.log('WEIGHT OUTPUT:\n', neuralNetwork.weightOutput)

        // INITIALIZE VARIABLES (ya, yb, yd...)

        neuralNetwork.initVariables()

        // ART B
        let newWOutput = neuralNetwork.artB()
        console.log('NEW W. OUTPUT:\n', newWOutput)

        // ART A
        let newWInput = neuralNetwork.artA()
        console.log('NEW W. INPUT:\n', newWInput)
    })

    console.log('TERMOS DIGITADOS: \n', dataText)

    if (textSplited.length > 1) {

        datas.forEach(data => {

            const textInfoParsed = data.textInfo
                .normalize('NFD')
                .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
                .toLowerCase()

            if (textInfoParsed.includes(textSearched)) {
                const indexTextInfo = textInfoParsed.indexOf(textSearched)

                dataSearched.push({
                    _id: data._id,
                    tags: textSplited,
                    title: data.title,
                    url: data.url,
                    host: data.host,
                    textInfo: data.textInfo.substring(indexTextInfo - 100, indexTextInfo + 100) + ' ...',
                    page
                })

                if (cont === 9) {
                    page++
                    cont = 0
                }

                cont++
            }

        })
    } else {
        datas.forEach(data => {
            const tagsWithoutStopwords = data.tagsWithoutStopwords
            const tags = tagsWithoutStopwords.map(tag => tag.name)

            if (tags.includes(textSearched)) {
                const indexTag = data.tags.indexOf(textSearched)
                const textInfoParsed = data.textInfo
                    .normalize('NFD')
                    .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
                    .toLowerCase()
                const indexTextInfo = textInfoParsed.indexOf(textSearched)

                dataSearched.push({
                    _id: data._id,
                    tags: textSplited,
                    title: data.title,
                    url: data.url,
                    host: data.host,
                    textInfo: data.textInfo.substring(indexTextInfo - 100, indexTextInfo + 100) + ' ...',
                    page
                })

                cont++

                if (cont >= 10) {
                    page++
                    cont = 0
                }

            }

        })   
    }

    const totalPages = cont === 0 ? page - 1 : page
    const length = dataSearched.length

    return { dataSearched, totalPages, length }

}