const express = require('express');
const app = express();
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
var session = require('express-session')
const {MongoClient} = require('mongodb');
const uri = process.env.MONGO_URI
const dataArray = []
const tagsArray = []
let jongens = [];

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));  
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))   
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("pages/index"));
app.get("/matchen", (req, res) => res.render("pages/matchen"));
app.get("/profielen", (req, res) => res.render("pages/profielen"));
app.get('/matchen', form)
app.get('/logout', logout);
app.post('/', matchen)
app.post('/matchen', matchen)   
app.post('/profielen', deleteFromDatabase)



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
    console.log('daaaataaaaa', data)

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

function logout(req, res, next) {
    req.session.destroy(function (err) {
      if (err) {
        next(err)
      } else {
        res.redirect('/matchen')
      }
    })
  }
  

async function deleteFromDatabase(req, res){

console.log('Deleted from Database');

console.log(req.body.sporten);

console.log('Deleted from database req');

    // console.log('dataaaaa', data)
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
		await client.connect();

		const db = client.db('db01');
		const tags = await db.collection('tags').deleteOne({
            sporten: req.body.sporten
            })  
            res.render('pages/matchen')     
   
    } catch (e) {
        
        console.error(e);
    } finally {
        await client.close();
    }
}


function form(req, res) {
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
        data: data, persoon: req.session.jongens,
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