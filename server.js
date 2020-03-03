const express = require('express');
const app = express();
// const path = require('path');
var slug = require('slug')
var bodyParser = require('body-parser')
const data = []

app.use(express.static('public'));

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
    var id = slug(req.body.sport).toLowerCase()

    data.push({
        id: id,
        sport: req.body.sport,
        anders:req.body.anders, 
        amount: req.body.amount,
    })
    res.render('pages/profielen', {data: data})
}

const test = "test";
// // Route home
// app.get('/home', function(req, res) {
//     res.sendFile(path.join(__dirname+'/public/index.html'));
// });


// // Query params
// app.get('/home/name/:Naam/gender/:Gender', function (req, res) {
//     res.send(req.params)
//     console.log(req.params);
//   })

// Show 404 
app.use(function (req, res) {
    res.type('text/plain')
    res.status(404)
    res.send('404 Not Found')
})
app.listen(3000, () => console.log('App listening on port 3000!'));