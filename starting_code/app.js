/* 
 * Package Imports
*/

const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy

const path = require("path");
require("dotenv").config();
const express = require('express');
const partials = require('express-partials');


const app = express();


/*
 * Variable Declarations
*/

const PORT = 3000;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

/*
 * Passport Configurations
*/
passport.use(new GitHubStrategy({
    clientID: 'Ov23liqzO9kobd6OycVn',
    clientSecret: '3196a58dbb2aad2f2ffb41fc5820ffbec6e91409',
    callbackURL: "http://localhost:3000/auth/github/callback"
}))






/*
 *  Express Project Setup
*/

app.use(session({
  secret:'codecademy', 
  resave: false,
  saveUnitialized: false
}))

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(partials());
app.use(express.json());
app.use(express.static(__dirname + '/public'));




/*
 * Routes
*/

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
})

app.get('/account', (req, res) => {
  res.render('account', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('login', { user: req.user });
})

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});




/*
 * Listener
*/

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

/*
 * ensureAuthenticated Callback Function
*/

