const Url = require('../../models/Url')

const rp = require('request-promise')
const cheerio = require('cheerio')

const data = []

module.exports = async function handleRunCrawler(page, dataUrl, callback) {

    await page.goto(dataUrl[0]);
    console.log('Puppeteer - PAGINA ENCAMINHADA PARA: ' + dataUrl[0])

    const pageTittle = await page.title()
    console.log(pageTittle)

    const listOfSickness = ".list-group a.list-group-item-action"
    await page.waitForSelector(listOfSickness)
    console.log('Puppeteer - VERIFICADO O SELETOR: ' + listOfSickness)

    const itemData = await page.evaluate(listOfSickness => {
        const anchors = Array.from(document.querySelectorAll(listOfSickness))

        return anchors.map((anchor) => {
            return { 
                title: anchor.textContent,
                url: anchor.href,
                host: anchor.host
            } 
            
        })
    }, listOfSickness)
    console.log('Puppeteer - URLS GRAVADAS')
    
    getDataInfoAndPushToArray(itemData, callback)

}

function getDataInfoAndPushToArray(itemData, cb) {

    console.log('getDataInfoAndPushToArray - FUNCAO INICIADA')

    let i = 0
    async function next() {
        if (i < itemData.length) {
            const itemExists = await Url.findOne({ url: itemData[i].url })
            
            if (!itemExists) {
                rp(itemData[i].url, async (err, res, body) => {
                    if ((!err) && (res.statusCode !== 404)) {
                        let $ = cheerio.load(body)

                        if ($) {
                            const title = $('head').find('title').text()
                            const textInfo = $('.item-page').find('p').text()
                            const textInfoParsed = textInfo
                                .normalize('NFD')
                                .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
                                .toLowerCase()
                            
                            const textInfoTags = textInfoParsed.split(' ')


                            if (title && textInfo) {
                                data.push(await Url.create({
                                    title,
                                    url: itemData[i].url,
                                    host: itemData[i].host,
                                    textInfo,
                                    tags: textInfoTags
                                }))                      
                            }
                            
                            ++i

                            return next()

                        }
                    } else {
                        console.log('getDataInfoAndPushToArray - ERRO: NÃO FOI POSSIVEL ACESSAR A URL: ' + itemData[i].url + '\nSTATUS CODE - ' + res.statusCode)
                        ++i

                        return next()
                    }

                })
            } else {
                ++i

                return next()
            }
        } else {
            console.log('getDataInfoAndPushToArray - FUNCAO FINALIZADA')
            cb(data)
        }
    
    }

    return next()

}
