const firebase = require('firebase/app')

const request = require('request')
const cheerio = require('cheerio')

const fs = require('fs')
const path = require('path')

const handleMakeSearch = require('../functions/search')

module.exports = {
    search(req, res) {
        const { q = "" } = req.query

        let words = q.toLowerCase()

        if (words) {

            handleMakeSearch(words, (results) => {
                
                console.log(results)

                return res.json(results)

            })

        }

    }
}



// 
// if($('div p')) {
//     $('body').find('div p').each((key, element) => {
//         let text = $(element).text()

//         text = text.split(' ')
//         text.forEach((element, index) => {
//             if (element === word) {
//                 dados.push({
//                     url,
//                     text
//                 })   
//             }
//         })
//     })
// }

// if($('div h1')) {
//     $('body').find('div h1').each((key, element) => {
//         let text = $(element).text()

//         text = text.split(' ')
//         text.forEach((element, index) => {
//             if (element === word) {
//                 dados.push({
//                     url,
//                     text
//                 })   
//             }
//         })
//     })
// }

// if($('div h2')) {
//     $('body').find('div h2').each((key, element) => {
//         let text = $(element).text()

//         text = text.split(' ')
//         text.forEach((element, index) => {
//             if (element === word) {
//                 dados.push({
//                     url,
//                     text
//                 })   
//             }
//         })
//     })
// }

// if($('li p')) {
//     $('body').find('li p').each((key, element) => {
//         let text = $(element).text()

//         text = text.split(' ')
//         text.forEach((element, index) => {
//             if (element === word) {
//                 dados.push({
//                     url,
//                     text
//                 })   
//             }
//         })
//     })
// }

// if($('ul li p')) {
//     $('body').find('ul li p').each((key, element) => {
//         let text = $(element).text()

//         text = text.split(' ')
//         text.forEach((element, index) => {
//             if (element === word) {
//                 dados.push({
//                     url,
//                     text
//                 })   
//             }
//         })
//     })
// }

// if($('li')) {
//     $('body').find('li').each((key, element) => {
//         let text = $(element).text()

//         text = text.split(' ')
//         text.forEach((element, index) => {
//             if (element === word) {
//                 dados.push({
//                     url,
//                     text
//                 })  
//             }
//         })
//     })
// }

// if($('ul li')) {
//     $('body').find('ul li em').each((key, element) => {
//         let text = $(element).text()

//         text = text.split(' ')
//         text.forEach((element, index) => {
//             if (element === word) {
//                 dados.push({
//                     url,
//                     text
//                 })   
//             }
//         })
//     })
// }
