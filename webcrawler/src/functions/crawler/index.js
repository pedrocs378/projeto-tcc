const Url = require('../../models/Url')

const rp = require('request-promise')
const cheerio = require('cheerio')
const puppeteer = require('puppeteer')

const data = []

module.exports = async function handleRunCrawler(dataUrl, callback) {

    const browser = await puppeteer.launch();
    console.log('Puppeteer - BROWSER INICIADO')

    const page = await browser.newPage();
    console.log('Puppeteer - NOVA PAGINA CRIADA')

    await page.goto(dataUrl[0]);
    console.log('Puppeteer - PAGINA ENCAMINHADA PARA: ' + dataUrl[0])

    const pageTittle = await page.title()
    console.log(pageTittle)

    const listOfSickness = "a.list-group-item-action"
    await page.waitForSelector(listOfSickness)
    console.log('Puppeteer - VERIFICADO O SELETOR: ' + listOfSickness)

    const itemData = await page.evaluate(listOfSickness => {
        const anchors = Array.from(document.querySelectorAll(listOfSickness))

        return anchors.map(async (anchor) => {
            const dataExist = await Url.find({ url: anchor.href })

            if (dataExist.length === 0) {
                return { 
                    title: anchor.textContent,
                    url: anchor.href,
                    host: anchor.host
                } 
            } else {
                return {
                    status: 400
                }
            }
        })
    }, listOfSickness)
    console.log('Puppeteer - URLS GRAVADAS')

    await browser.close()
    console.log('Puppeteer - BROWSER FECHADO')
    
    getDataInfoAndPushToArray(itemData, callback)

    // rp(options)
    //     .then(data => {
    //         const urls = []

    //         if ($) {
    //             handleSearchTags($, '.list-group', 'a.list-group-item', urls)
    //         }
    //         console.log(data)
    //         getDataInfoAndPushToArray(urls, callback)

    //     })
    //     .then(urls => {

    //         const newUrls = []

    //         urls.forEach((link) => {
    //             if (link && (link.split(':')[0] === 'http' || link.split(':')[0] === 'https')) {
    //                 newUrls.push(link)
    //             }
    //         })

    //         getDataInfoAndPushToArray(newUrls, callback)
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     })

}

function getDataInfoAndPushToArray(itemData, cb) {

    console.log('getDataInfoAndPushToArray - FUNCAO INICIADA')
    
    let i = 0
    function next() {
        if (i < itemData.length) {
            console.log('getDataInfoAndPushToArray > next() - IT' + i)
            if (itemData[i].url) {
                rp(itemData[i].url, async (err, res, body) => {
                    if (!err) {
                        let $ = cheerio.load(body)

                        if ($) {
                            const title = $('head').find('title').text()
                            const textInfo = $('.item-page').find('p').text()

                            if (title && textInfo) {
                                data.push(await Url.create({
                                    title,
                                    url: itemData[i].url,
                                    host: itemData[i].host,
                                    textInfo
                                }))                      
                            }

                            ++i

                            return next()

                        }

                    }
                })
            }
        } else {
            console.log('getDataInfoAndPushToArray - FUNCAO FINALIZADA')
            cb(data)
        }
    
    }

    return next()

}
