const Url = require('../models/Url')

const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const path = require('path')

const sites = require('../../sites.json')

module.exports = function executeCrawler(urls) {

    urls.forEach(({ url }) => {
        
        request(url, (err, res, body) => {
            if (!err) {

                let $ = cheerio.load(body)

                if ($) {
                    if ($('body')) {
                        $('body').find('a').each(async (key, element) => {
                            let link = $(element).attr('href')

                            if (link && (link.split(':')[0] === 'http' || link.split(':')[0] === 'https')) {
                                if (link.trim().startsWith('/')) {
                                    link = res.href + link.trim()
                                }

                                if (link.split('/')[0] === 'undefined') {
                                    if (link.split('/')[1]) {
                                        
                                    }
                                }

                                if (!(link.includes('clicklogger'))) {
                                    
                                }
                            }
                        })
                    }
                }
            }
        })
    })

}

