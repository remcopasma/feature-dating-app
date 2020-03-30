const express = require('express');
const app = express();
const dotenv = require('dotenv').config()
const bodyParser = require('body-parser')
const session = require('express-session')
const {MongoClient} = require('mongodb');
const helmet =require('helmet');
const uri = process.env.MONGO_URI
const tagsArray = []
let jongens = []

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'));  
app.use(helmet());
app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
  }))   
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("pages/index"));
app.get("/matchen", (req, res) => res.render("pages/matchen"));
app.get("/profielen", (req, res) => res.render("pages/profielen"));
app.get("/account", (req, res) => res.render("pages/account"));
app.get("/update", (req, res) => res.render("pages/update"));
app.get("/delete", (req, res) => res.render("pages/delete"));
app.get('/matchen', form)
app.get('/logout', logout);
app.post('/matchen', matchen)   
app.post('/profielen', deleteFromDatabase)
app.post('/account', updateDb)

async function callDatabase(vanWaarWilIkHetHebben, watIkWilHebben){

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    
    try {
        await client.connect();
        
		const db = client.db('db01');
        
		const data = await db.collection(`${vanWaarWilIkHetHebben}`).find({}).toArray();
        data.forEach(person =>{
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

async function updateDb(tags){
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
		await client.connect();

		const db = client.db('db01');
		const updateTags = await db.collection('tags').updateOne(
            { "_id": req.body._id}, // Filter
            {$set: {"aantal": req.body.aantal}}, 
            {$set: {"sporten": req.body.sporten}},// Update
            {upsert: true} // add document with req.body._id if not exists 

       )
      .then((obj) => {
         console.log('Updated - ' + obj);
        res.redirect('orders')
   })
    .catch((err) => {
    console.log('Error: ' + err);
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
    writeDb(req.body)
    const jongens = [];
    const boysToRender = [];
    const person =[]
    let data;
    if (req.body.sporten.length < 1){
        for (let index = 0; index < req.body.sporten.length; index++) {
            const sporten = req.body.sporten[index];
            const partData = await callDatabase('personen',`${sporten}`)
            for (let index = 0; index < partData.length; index++) {
                const element = partData[index];
            if(boysToRender.includes(partData) == false){
                jongens.push(person)
                }
            }
            boysToRender.push(partData);
            data = boysToRender
        }
    } else{
        data = await callDatabase('personen',`${req.body.sporten}`)
    }

    const tags = await callDbTags(req.body.sporten)
    tagsArray.push(req.body.sporten)
    req.session.data = {sporten: data}
    const { sporten } = req.session.data

    
    res.render('pages/profielen', {
        data: data,
        sporten: sporten,
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