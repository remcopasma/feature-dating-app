const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const data = []
const mongo = require('mongodb')
app.use(express.static('public'));
require('dotenv').config()

// Using ejs
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("pages/index"));
app.get("/matchen", (req, res) => res.render("pages/matchen"));
app.get("/profielen", (req, res) => res.render("pages/profielen"));

// Database connection
var db = null
var url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT
console.log("dit is de url", url);
mongo.MongoClient.connect(url, function (err, client) {
  if (err) throw err
  console.log("no error occured")
  db = client.db(process.env.DB_NAME)
//   console.log("this is the database", db)
})


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
    db.collection('tags').insertOne({
        sporten: req.body.sporten,
        anders:req.body.anders, 
        aantal: req.body.aantal
      }, done)
    
      function done(err, data) {
        if (err) {
          next(err)
        } else {
          res.redirect('/' + data.insertedId)
        }
      }
    data.push({
        sporten: req.body.sporten,
        anders:req.body.anders, 
        aantal: req.body.aantal
    })
    console.log(data);
    res.render('pages/profielen', {data: data})

}




// Show 404 
app.use(function (req, res) {
    res.type('text/plain')
    res.status(404)
    res.send('404 Not Found')
})
app.listen(3000, () => console.log('App listening on port 3000!'));