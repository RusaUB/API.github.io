const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
const PORT = process.env.PORT || 3000

const app = express()
const articles = []
const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment'
    },
    {
        name: 'gaurdian',
        address: 'https://www.theguardian.com/environment/climate-crisis'
    },
    {
        name: 'telegraph',
        address : 'https://www.telegraph.co.uk/climate-change/'
    }
]

newspapers.forEach(newspapers => {
    axios.get(newspapers.address)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        $('a:contains("climate")', html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')

            articles.push({
                title,
                url,
                source: newspapers.name
            })
        })
    })
})

app.get('/', (req,res) =>{
    res.json('Welcome')
})

app.get('/news', (req,res) => {
    res.json(articles)
})

const dotenv = require('dotenv')
dotenv.config()

//
console.log(process.env.DBHOST)

app.get('/news/:newspaperId', (req,res) => {
    const newspaperId = req.params.newspaperId
    const newspaperAdress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    
    axios.get(newspaperAdress)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        const scpecificArticles = []
        
        $('a:contains("climate")', html).each(function(){
            const title = $(this).text()
            const url = $(this).attr('href')
            scpecificArticles.push({
                title,
                url,
                source: newspaperId
            })
        }) 
        res.json(scpecificArticles)
    }).catch(err => console.log(err))
})

app.listen(PORT, () => {
    console.log('running')
})
