const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const {MongoClient} = require('mongodb');
const dataArray = []
const tagsArray = []
let jongens = [];



app.use(express.static('public'));
require('dotenv').config()

// Using ejs
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("pages/index"));
app.get("/matchen", (req, res) => res.render("pages/matchen"));
app.get("/profielen", (req, res) => res.render("pages/profielen"));

// Database connection
const uri = process.env.MONGO_URI

async function callDatabase(vanWaarWilIkHetHebben, watIkWilHebben){
    console.log('waaarikhet',watIkWilHebben)
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    try {
        await client.connect();
        
		const db = client.db('db01');
        
		const data = await db.collection(`${vanWaarWilIkHetHebben}`).find({}).toArray();
        data.forEach(person =>{
            console.log(person.sporten.includes(watIkWilHebben))
            if(person.sporten.includes(watIkWilHebben)){
                jongens.push(person)
            } else{
                console.log(person.name,'heeft geen gemeenschappelijke sporten');
            }
        });
        console.log('jongens met wie je een gemeenschappelijke sport deelt',jongens)
        return jongens

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
const vanuitWaar = 'personen'

async function callDbTags(){

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
		await client.connect();

		const db = client.db('db01');

		const tags = await db.collection('tags').find({}).toArray();
		// console.log('DEEEEEEEEEEEE',tags);


    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}
callDbTags().catch(console.error);

async function writeDb(data){

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
		await client.connect();

		const db = client.db('db01');
		const tags = await db.collection('tags').insertOne({
                sporten: data.sporten,
                anders: data.anders, 
                aantal: data.aantal
            })
          
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function deleteFromDatabase(data){
    console.log('dataaa', data)
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
		await client.connect();

		const db = client.db('db01');
		const tags = await db.collection('tags').deleteOne({
            sporten: data.sporten
            })
          console.log('taaaags',tags)
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



app.post('/profielen', deleteFromDatabase)

function form(req, res) {
    console.log('form')
    console.log(res.body)
    res.render('matchen.ejs')
}   

async function matchen(req, res) {
    console.log('matchen')
    writeDb(req.body)
    jongens = [];
    const boysToRender = [];
    const person =[]
    let data;
    if (req.body.sporten.length < 1){
        for (let index = 0; index < req.body.sporten.length; index++) {
            const sporten = req.body.sporten[index];
            const partData = await callDatabase('personen',`${sporten}`)
            // in boystorender moeten we zoeken of de persoon er al in zit voooooordat we pushen
            for (let index = 0; index < partData.length; index++) {
                const element = partData[index];
            if(boysToRender.includes(partData) == false){
                jongens.push(person)
                }
            }
            boysToRender.push(partData);
            data = boysToRender
            // console.log(sporten)
        }
    } else{
        // console.log("we zitten in de else")
        data = await callDatabase('personen',`${req.body.sporten}`)
        // console.log(req.body.sporten)
    }

    const tags = await callDbTags(req.body.sporten)
  
    tagsArray.push(req.body.sporten);
    res.render('pages/profielen', {
        data: data,
        tagsArray: tagsArray
    })     
}    


// Show 404 
app.use(function (req, res) {
    res.type('text/plain')
    res.status(404)
    res.send('404 Not Found')
})
app.listen(3000, () => console.log('App listening on port 3000!'));