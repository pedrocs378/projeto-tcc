const Network = require("../../models/Network")
const Stopword = require("../../models/Stopword")
const Url = require('../../models/Url')
const NetworkController = require('./index')

const {
    alpha,
    beta,
    pA,
    pAB,
    pB,
    pD,
    epsilon,
    phase
} = require('../../configs/networkConfig')
const convertNumber = require('../../utils/convertForZeroToOne')
const { convertStringToNumber, normalizeWord } = require('../../utils/wordUtils')


module.exports = async function(datas, textSplited) {

    const tagsWithoutStopwords = await Url.find({}, '-_id tagsWithoutStopwords.value')
    const valueTags = tagsWithoutStopwords
        .map(tag => tag.tagsWithoutStopwords)
        .map((tag) => { return tag.map(({ value }) => value) })

    const stopwords = await Stopword.find({})

    const stopwordsParsed = stopwords
        .map(({ word }) => {
            return normalizeWord(word)
        })

    const dataText = textSplited
        .map((tag) => {
            if (!(stopwordsParsed.includes(tag))) {
                return {
                    name: tag,
                    value: convertStringToNumber(tag)
                }
            } else {
                return null
            }
        })
        .filter(el =>
            (el != null) ? (el.name.trim() != "") ? true : false : false)

    const valuesText = dataText.map(data => data.value)
    const valuesNormalized = convertNumber(valuesText)

    const dataSearch = []

    // NETWORK

    valueTags.forEach((values, index) => {
        // console.log('\n\nURL ACESSADA:', datas[index].url)
        const neuralNetwork = new NetworkController(pA, pB, pAB, pD, alpha, beta, epsilon, phase)

        // SET INPUTS
        neuralNetwork.setInputValues(valuesNormalized, valuesNormalized.length, 1)
        let inputNetwork = neuralNetwork.getInputValues
        // console.log('INPUT:\n', inputNetwork)

        let input = neuralNetwork.realizaComplemento(inputNetwork, inputNetwork.length, inputNetwork[0].length)
        neuralNetwork.complementA = input
        // console.log('COMPL. INPUT:\n', neuralNetwork.complementA)

        let wInput = neuralNetwork.inicializaValores(neuralNetwork.complementA.length, neuralNetwork.complementA[0].length, 1)
        neuralNetwork.weightInput = wInput
        // console.log('WEIGHT INPUT:\n', neuralNetwork.weightInput)

        // SET OUTPUTS
        const valueTagsNormalized = convertNumber(values)
        neuralNetwork.setOutputValues(valueTagsNormalized, valuesNormalized.length, valueTagsNormalized.length)
        let outputNetwork = neuralNetwork.getOutputValues
        // console.log('OUTPUT:\n', outputNetwork)

        let output = neuralNetwork.realizaComplemento(outputNetwork, outputNetwork.length, outputNetwork[0].length)
        neuralNetwork.complementB = output
        // console.log('COMPL. OUTPUT:\n', neuralNetwork.complementB)

        let wOutput = neuralNetwork.inicializaValores(neuralNetwork.complementB.length, neuralNetwork.complementB[0].length, 1)
        neuralNetwork.weightOutput = wOutput
        // console.log('WEIGHT OUTPUT:\n', neuralNetwork.weightOutput)

        // INITIALIZE VARIABLES (ya, yb, yd...)

        neuralNetwork.initVariables()

        // ART B
        let newWOutput = neuralNetwork.artB()
        // console.log('NEW W. OUTPUT:\n', newWOutput)

        // ART A
        let newWInput = neuralNetwork.artA()
        // console.log('NEW W. INPUT:\n', newWInput)

        // DIAGNOSTIC
        neuralNetwork.complementD = neuralNetwork.complementA
        let outputDiag = neuralNetwork.diagnostico()

        // console.log('#########################################################')
        // console.log('VALORES ENCONTRADOS')
        // console.log('#########################################################')

        let found = false

        for (let i = 0; i < neuralNetwork.getInputValues.length; i++) {
            for (let j = 0; j < outputDiag[0].length; j++) {
                if (neuralNetwork.getInputValues[i][0] === outputDiag[i][j]) {
                    // console.log(`VALOR ${outputDiag[i][j]} ENCONTRADO:\n`, outputDiag)

                    found = true
                    dataSearch.push({
                        pageId: datas[index]._id,
                        wBD: outputDiag
                    })

                    break
                }
            }

            if (found) {
                break
            }
        }
    })

    const inputText = dataText
        .map(data => data.name)
        .join(' ')

    Network.create({
        input: inputText,
        dataSearch
    })


    console.log('TERMOS DIGITADOS: \n', dataText)

}