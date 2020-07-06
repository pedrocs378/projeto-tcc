const firebase = require('firebase/app')

const request = require('request')
const cheerio = require('cheerio')

const fs = require('fs')
const path = require('path')

const sites = require('../../sites.json')

module.exports = {
    init(req, res) {

        const ref = firebase.database().ref('/sites/')

        ref.set(sites) 
        
        let data = []
        let key = 0
        ref.once('value', function(snapshot) {

            snapshot.forEach(function(childSnapshot, index) {

                childSnapshot.forEach(function(child, i){
                    key = parseInt(child.key) 
                })

                let refChild = childSnapshot.ref
                let newKey = key + 1

                request(childSnapshot.val()[0].url, (err, response, body) => {
                    if (!err) {                  

                        let $ = cheerio.load(body)

                        if($) {

                            if($('body')) {
                                $('body').find('a').each((key, element) => {
                                    let link = $(element).attr('href')

                                    if(link && (link.split(':')[0] === 'http' || link.split(':')[0] === 'https')) {
                                        if(link.trim().startsWith('/')){
                                            link = response.href + link.trim()
                                        }

                                        if (link.split('/')[0] === 'undefined'){
                                            if (link.split('/')[1]) {
                                                data.push({
                                                    host: childSnapshot.val()[0].host,
                                                    title: childSnapshot.val()[0].title,
                                                    link: link.trim()
                                                }) 
                                                
                                                refChild.child(newKey).set({
                                                    host: childSnapshot.val()[0].host,
                                                    title: childSnapshot.val()[0].title,
                                                    url: link.trim()
                                                })

                                                newKey = newKey + 1
                                            }
                                        }

                                        if (!(link.includes('clicklogger'))) {
                                            data.push({
                                                host: childSnapshot.val()[0].host,
                                                title: childSnapshot.val()[0].title,
                                                link: link.trim()
                                            })
    
                                            refChild.child(newKey).set({
                                                host: childSnapshot.val()[0].host,
                                                title: childSnapshot.val()[0].title,
                                                url: link.trim()
                                            })
    
                                            newKey = newKey + 1
                                        }
                                        
                                    }
                                })

                                if($('div a')) {
                                    $('body').find('div a').each((key, element) => {
                                        let link = $(element).attr('href')

                                        if(link && (link.split(':')[0] === 'http' || link.split(':')[0] === 'https')) {
                                            if(link.trim().startsWith('/')){
                                                link = response.href + link.trim()
                                            }

                                            if (link.split('/')[0] === 'undefined'){
                                                if (link.split('/')[1]) {
                                                    data.push({
                                                        host: childSnapshot.val()[0].host,
                                                        title: childSnapshot.val()[0].title,
                                                        link: link.trim()
                                                    })  
                                                    
                                                    refChild.child(newKey).set({
                                                        host: childSnapshot.val()[0].host,
                                                        title: childSnapshot.val()[0].title,
                                                        url: link.trim()
                                                    })
                                                    newKey = newKey + 1
                                                }
                                            }
        
                                            if (!(link.includes('clicklogger'))) {
                                                data.push({
                                                    host: childSnapshot.val()[0].host,
                                                    title: childSnapshot.val()[0].title,
                                                    link: link.trim()
                                                })
        
                                                refChild.child(newKey).set({
                                                    host: childSnapshot.val()[0].host,
                                                    title: childSnapshot.val()[0].title,
                                                    url: link.trim()
                                                })
        
                                                newKey = newKey + 1
                                            }
                                        }
                                    })
                                }

                                if($('li a')) {
                                    $('body').find('li a').each((key, element) => {
                                        let link = $(element).attr('href')

                                        if(link && (link.split(':')[0] === 'http' || link.split(':')[0] === 'https')) {
                                            if(link.trim().startsWith('/')){
                                                link = response.href + link.trim()
                                            }

                                            if (link.split('/')[0] === 'undefined'){
                                                if (link.split('/')[1]) {
                                                    data.push({
                                                        host: childSnapshot.val()[0].host,
                                                        title: childSnapshot.val()[0].title,
                                                        link: link.trim()
                                                    })   

                                                    refChild.child(newKey).set({
                                                        host: childSnapshot.val()[0].host,
                                                        title: childSnapshot.val()[0].title,
                                                        url: link.trim()                                                   
                                                    })

                                                    newKey = newKey + 1
                                                }
                                            }
        
                                            if (!(link.includes('clicklogger'))) {
                                                data.push({
                                                    host: childSnapshot.val()[0].host,
                                                    title: childSnapshot.val()[0].title,
                                                    link: link.trim()
                                                })
        
                                                refChild.child(newKey).set({
                                                    host: childSnapshot.val()[0].host,
                                                    title: childSnapshot.val()[0].title,
                                                    url: link.trim()
                                                })
        
                                                newKey = newKey + 1
                                            }
                                            
                                        }
                                    })   
                                }

                                if($('ul > li a')) {
                                    $('body').find('ul > li a').each((key, element) => {
                                        let link = $(element).attr('href')

                                        if(link && (link.split(':')[0] === 'http' || link.split(':')[0] === 'https')) {
                                            if(link.trim().startsWith('/')){
                                                link = response.href + link.trim()
                                            }

                                            if (link.split('/')[0] === 'undefined'){
                                                if (link.split('/')[1]) {
                                                    data.push({
                                                        host: childSnapshot.val()[0].host,
                                                        title: childSnapshot.val()[0].title,
                                                        link: link.trim()
                                                    })   

                                                    refChild.child(newKey).set({
                                                        host: childSnapshot.val()[0].host,
                                                        title: childSnapshot.val()[0].title,
                                                        url: link.trim()
                                                        
                                                    })
                                                    newKey = newKey + 1
                                                }
                                            }
        
                                            if (!(link.includes('clicklogger'))) {
                                                data.push({
                                                    host: childSnapshot.val()[0].host,
                                                    title: childSnapshot.val()[0].title,
                                                    link: link.trim()
                                                })
        
                                                refChild.child(newKey).set({
                                                    host: childSnapshot.val()[0].host,
                                                    title: childSnapshot.val()[0].title,
                                                    url: link.trim()
                                                })
        
                                                newKey = newKey + 1
                                            }
                                        }
                                    })   
                                }
                            }

                            if (response.href) data.push(response.href)
                        }
                    }                        
                    // console.log(data)
                    let stream = fs.createWriteStream(path.join(__dirname, '../files/links.txt'))
                    data.forEach(data => stream.write('host: ' +data.host+ ' | title: ' +data.title+ ' | link: ' + data.link + '\n'))
                    stream.end()

                                            
                })
                
            })
            return res.json(data)
            
        })

    }
}

