const Url = require('../../models/Url')
const Stopword = require('../../models/Stopword')

const rp = require('request-promise')
const cheerio = require('cheerio')

const convertString = require('../../utils/convertStringToNumber')
const filterByProperty = require('../../utils/filterByProperty')

module.exports = async function handleRunCrawler(page, callback) {

    const url = 'http://saude.gov.br/saude-de-a-z'

    await page.goto(url);
    console.log('Puppeteer - PAGINA ENCAMINHADA PARA: ' + url)

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

async function getDataInfoAndPushToArray(itemData, cb) {

    console.log('getDataInfoAndPushToArray - FUNCAO INICIADA')
    const stopwords = await Stopword.find({})
    const stopwordsParsed = stopwords.map(({ word }) => {
        return word
            .normalize('NFD')
            .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
            .toLowerCase()
    })

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
                            const textItemPage = $('.item-page').text()
                            const textInfo = textItemPage
                                .replace(/([\n{2,}]|[\t{2,}]|[→{1,}])/g, ' ')
                                .replace(/\s{2,}/g, ' ')
                            // const textInfo = $('.item-page').find('p').text()
                            const textInfoParsed = textInfo
                                .normalize('NFD')
                                .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
                                .toLowerCase()
                            
                            const textInfoTags = textInfoParsed.split(' ')

                            const tagsWithoutStopwords = textInfoTags.map((tag) => {
                                if (!(stopwordsParsed.includes(tag))) {
                                    return { 
                                        name: tag, 
                                        value: convertString(tag)
                                    }
                                } else {
                                    return null
                                }
                            }) 

                            const tagsWithoutNulls = tagsWithoutStopwords.filter(el => 
                                (el != null) ? (el.name.trim() != "") ? true : false : false)

                            const tagsWthtStpwrdsFiltered = filterByProperty(tagsWithoutNulls, 'name')

                            if (title && textInfo) {
                                await Url.create({
                                    title,
                                    url: itemData[i].url,
                                    host: itemData[i].host,
                                    textInfo,
                                    tags: textInfoTags,
                                    tagsWithoutStopwords: tagsWthtStpwrdsFiltered
                                })                      
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
            cb()
        }
    
    }

    return next()

}