const Stopword = require("../models/Stopword")

module.exports = function() {
    Stopword
        .find({})
        .then(stopwords => {
            const stopwordsParsed = stopwords
                .map(({ word }) => {
                    return word
                        .normalize('NFD')
                        .replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')
                        .toLowerCase()
                })

            return stopwordsParsed
        })       
}