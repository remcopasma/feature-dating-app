const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const data = []
const {MongoClient} = require('mongodb');
app.use(express.static('public'));
require('dotenv').config()

// Using ejs
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("pages/index"));
app.get("/matchen", (req, res) => res.render("pages/matchen"));
app.get("/profielen", (req, res) => res.render("pages/profielen"));

// Database connection
const uri = process.env.MONGO_URI
async function callDatabase(){

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
		await client.connect();

		const db = client.db('db01');

		const tags = await db.collection('personen').find({}).toArray();
        console.log(tags);
        return tags


    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
callDatabase()

async function writeDb(data){
    console.log('writeDb')
    console.log(data)
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
		await client.connect();

		const db = client.db('db01');

		const tags = await db.collection('tags').insertOne({
                sporten: data.sporten,
                anders: data.anders, 
                aantal: data.aantal
            })
        console.log(tags);   
          
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}


// Getting input form
app.get('/matchen', form)
app.use(bodyParser.urlencoded({ extended: true }))
app.post('/', matchen)
app.post('/matchen', matchen)

function form(req, res) {
    console.log('form')
    console.log(res.body)
    res.render('matchen.ejs')
}   

async function matchen(req, res) {
    console.log('matchen')
    console.log(req.body)
    writeDb(req.body)
    const data = await callDatabase()
    res.render('pages/profielen', {data: data})
}    

// Show 404 
app.use(function (req, res) {
    res.type('text/plain')
    res.status(404)
    res.send('404 Not Found')
})
app.listen(3000, () => console.log('App listening on port 3000!'));