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
const { convertStringToNumber } = require('../../utils/wordUtils')


module.exports = async function(datas, textSplited, stopwords) {

    const tagsWithoutStopwords = await Url.find({}, '-_id tagsWithoutStopwords.value')
    const valueTags = tagsWithoutStopwords
        .map(tag => tag.tagsWithoutStopwords)
        .map((tag) => { return tag.map(({ value }) => value) })

    const dataText = textSplited
        .map((tag) => {
            if (!(stopwords.includes(tag))) {
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

    const inputText = dataText
        .map(data => data.name)
        .join(' ')

    const itemExists = await Network.findOne({ input: inputText })

    if (!itemExists) {
        const valuesText = dataText.map(data => data.value)
        const valuesNormalized = convertNumber(valuesText)
        console.log('search:executeNetwork - VALORES ENTRADA', valuesNormalized)
    
        const dataSearch = []
        
        // NETWORK
    
        valueTags.forEach((values, index) => {
            // console.log('\n\nsearch:executeNetwork - URL ACESSADA:', datas[index].url)
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
    

            // console.log('INICIALIZA VARIAVEIS')
            // INITIALIZE VARIABLES (ya, yb, yd...)
            neuralNetwork.initVariables()
    
            // ART B
            neuralNetwork.artB()
            // console.log('NEW W. OUTPUT:\n', newWOutput)
    
            // ART A
            neuralNetwork.artA()
            // console.log('NEW W. INPUT:\n', newWInput)
    
            // DIAGNOSTIC
            neuralNetwork.complementD = neuralNetwork.complementA
            let outputDiag = neuralNetwork.diagnostico()
    
            let inserted = false
            let dataAux = {}
            const contPages = new Array(valuesNormalized.length).fill(0)
    
            for (let i = 0; i < neuralNetwork.getInputValues.length; i++) {
                for (let j = 0; j < outputDiag[0].length; j++) {
                    if (neuralNetwork.getInputValues[i][0] === outputDiag[i][j]) {
                        contPages[i] += 1
    
                        if (!inserted) {
                            inserted = true
                            dataAux = {
                                pageId: datas[index]._id
                            }
                        }                
                    }
                }
            }
    
            if (inserted) {
                dataSearch.push({
                    ...dataAux,
                    tagsPerPage: contPages
                })
            }
    
            inserted = false
        })
    
    
        Network.create({
            input: inputText,
            dataSearch
        })

    } else {
        console.log('executeNetwork - ITEM EXISTENTE')
    }

    console.log('TERMOS DIGITADOS: \n', dataText)

}