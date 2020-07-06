const puppeteer = require('puppeteer')
const firebase = require('firebase/app')

module.exports = {
    async create(req, res) {
        
        
        let ref = firebase.database().ref('/sites/tecmundo')

        const browser = await puppeteer.launch()
        const page = await browser.newPage()
        
        await ref.once('value', function(snapshot) {
            
            snapshot.forEach(function(childSnapshot) {
                page.goto(childSnapshot.val().url)
                console.log('Acessado')
            })

        })

        await browser.close()
    }

}