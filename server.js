const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const data = []
var multer = require('multer')

app.use(express.static('public'));


var upload = multer({dest: 'public/upload/'})
app.post('/', upload.single('cover'), matchen)


// Using ejs
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("pages/index"));
app.get("/matchen", (req, res) => res.render("pages/matchen"));
app.get("/profielen", (req, res) => res.render("pages/profielen"));

// Getting input form
app.get('/matchen', form)
app.use(bodyParser.urlencoded({ extended: true }))
app.post('/', matchen)

function form(req, res) {
    console.log('form')
    console.log(res.body)
    res.render('matchen.ejs')
}

function matchen(req, res) {
    console.log('matchen')
    console.log(req.body)

    data.push({
        sport: req.body.sport,
        anders:req.body.anders, 
        amount: req.body.amount,
        cover: req.file ? req.file.filename : null
    })
    console.log(data);
    res.render('pages/profielen', {data: data})
  
}

// Database connection
const mongo = require('mongodb')
require('dotenv').config()
  
var db = null
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT
console.log("dit is de url", url);
mongo.MongoClient.connect(url, function (err, client) {
  if (err) throw err
  console.log("no error occured")
  db = client.db(process.env.DB_NAME)
//   console.log("this is the database", db)
})
 

// Show 404 
app.use(function (req, res) {
    res.type('text/plain')
    res.status(404)
    res.send('404 Not Found')
})
app.listen(3000, () => console.log('App listening on port 3000!'));