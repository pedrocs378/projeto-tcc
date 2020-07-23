const Url = require('../models/Url')

const request = require('request')
const cheerio = require('cheerio')
const seenreq = require('seenreq')
const Crawler = require('crawler')
const fs = require('fs')
const path = require('path')

const sites = require('../../sites.json')
const uri = require('../uri.js')

module.exports = function executeCrawler(urls, callback) {

    const data = []

    for(let i = 0; i < urls.length; i++) {
        
        request(urls[i], (err, res, body) => {

            if (!err) {

                let $ = cheerio.load(body)
                
                if ($) {
                    data.push($('title').text())
                }

            }

        })
    }

    callback(data)

}

