const firebase = require('firebase/app')

const request = require('request')
const cheerio = require('cheerio')

const fs = require('fs')
const path = require('path')

module.exports = {
    init(req, res) {
        const { q = "" } = req.query

        const ref = firebase.database().ref('/sites/')
        let words = q.split(' ')
        let dados = []
        
        let urls = []

        let stream = fs.createWriteStream(path.join(__dirname, '../files/searchResult.txt'))
        stream.write('\n' + q.toUpperCase() + '\n')

        ref.once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
                childSnapshot.forEach(function(child){
                    urls.push(child.val().url)              
                
                })               
            })   
            
            for(let i = 0; i < urls.length; i++) {

                request(urls[i], function (err, response, body) {
    
                    if (!err) {
    
                        $ = cheerio.load(body)
    
                        if ($) {
                            if($('body')) {
                                $('body').find('p').each((index, element) => {
                                    
                                    let text = $(element).text()                                       
                                    let textArray = text.split(' ')
                                    
                                    if (text) {
                                        for(let w = 0; w < textArray.length; w++) {
                                            if (textArray[w] == q) {
                                                dados.push({
                                                    url: urls[i],
                                                    text
                                                })
                                                stream.write('url: ' + urls[i] + ' | text: ' + text + '\n')
                                                console.log('ELEMENTO ADICIONADO')
                                                break
                                            }   
                                        }
                                                                                                      
                                    }
                                                                                                 
                                })
                            }    
                        }
                    }
                })  
            }   
            res.json(dados)         
        })        
        
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
