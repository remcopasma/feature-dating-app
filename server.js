const express = require('express');
const app = express();
const path = require('path');

app.use(express.static('public'));

// Using ejs
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("pages/index"));

// Route home
app.get('/home', function(req, res) {
    res.sendFile(path.join(__dirname+'/public/index.html'));
});


// // Query params
// app.get('/home/name/:Naam/gender/:Gender', function (req, res) {
//     res.send(req.params)
//     console.log(req.params);
//   })

// Show 404 
app.use(function(req, res){
    res.type('text/plain')
    res.status(404)
    res.send('404 Not Found')
})
app.listen(3000, () => console.log('App listening on port 3000!'));