const { 
    // inicializaValores,
    // insertInputValues,
    // insertOutputValues,
    normalizaDados,
    // realizaComplemento,
} = require('../neuralNetwork')

const NetworkController = require('../neuralNetwork')

module.exports = function analyseText(textSearched, datas, valueTags) {

    let page = 1
    let cont = 0

    const neuralNetwork = new NetworkController

    const textSplited = textSearched.split(' ')
    const dataText = textSplited.map(text => {
        return {
            name: text,
            value: Math.random()
        }
    })
    const valuesText = dataText.map(data => data.value)

    const dataSearched = []
    const results = []

    // INPUTS
    neuralNetwork.setInputValues(valuesText, valuesText.length, 1)
    let inputNetwork = neuralNetwork.getInputValues
    console.log('INPUT:\n', inputNetwork)
    let input = neuralNetwork.realizaComplemento(inputNetwork, inputNetwork.length, inputNetwork[0].length)
    console.log('COMPL. INPUT:\n', input)
    let wInput = neuralNetwork.inicializaValores(input.length, input[0].length, 1)
    neuralNetwork.setWeightInput = wInput
    console.log('WEIGHT INPUT:\n', neuralNetwork.getWeightInput)
    
    // OUTPUTS
    neuralNetwork.setOutputValues(valueTags[0], valuesText.length, valueTags[0].length)
    let outputNetwork = neuralNetwork.getOutputValues
    console.log('OUTPUT:\n', outputNetwork)
    console.log('ROWS: ' +outputNetwork.length+ ' COLS: ' +outputNetwork[0].length)
    let output = neuralNetwork.realizaComplemento(outputNetwork, outputNetwork.length, outputNetwork[0].length)
    console.log('COMPL. OUTPUT:\n', output)
    console.log('ROWS: ' + output.length + ' COLS: ' + output[0].length)
    let wOutput = neuralNetwork.inicializaValores(output.length, output[0].length, 1)
    neuralNetwork.setWeightOutput = wOutput
    console.log('WEIGHT OUTPUT:\n', neuralNetwork.getWeightOutput)

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