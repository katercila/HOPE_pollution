const express = require("express");
const path = require('path');
const hbs = require('hbs');

const app = express();

// Set the views directory and view engine for the app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));


// Define a route handler for the root URL
// This renders the "main.hbs" view using the Handlebars templating engine
app.get('/', (req, res) => {
  res.render('main');
});
  
// this takes you to the home page
app.get('/home', (req, res) => {
  res.render('home');
});

app.listen(8000, () => {
  console.log('Server listening on port 8000');
});




