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
    }, function(accessToken, refreshToken, profile, done) {
         return done(null, profile);
  })
)

passport.serializeUser((user, done) => {
  done(null, user);
})

passport.deserializeUser(function(user, done) {
  done(null, user);
});


/*
 * ensureAuthenticated Callback Function
*/

const ensureAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()){ return next() };
  res.redirect('/login');
}


/*
 *  Express Project Setup
*/
app.use(passport.initialize())

app.use(passport.session());

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
app.get('/auth/github',
  passport.authenticate('github', { scope: ['user'] })
);

//implement the Authorization callback URL, which was defined in the GitHub application settings. This is where GitHub will redirect after a user authorizes it.


app.get('/auth/github/callback',
  passport.authenticate('github', { 
    failureRedirect: '/login',  // redirect users back to the login page in the event of a failed authorization
    successRedirect: '/'   // redirect users to the home page after a successful authorization attempt
  })
);

app.get('/', (req, res) => {
  res.render('index', { user: req.user });
})

app.get('/account', ensureAuthenticated, (req, res) => {
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


