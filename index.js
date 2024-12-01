const http = require('http');
const express = require('express'); // requiring express
const bodyParser = require('body-parser');
const port =  8000; // assigning the port, for running in local computer
const expressLayout = require('express-ejs-layouts');
const app = express();

// require the connect flash, to show notifications in flash messages
const flash = require('connect-flash'); 
const flashMiddleware = require('./config/flashMiddleware'); // Correcting the path

const db = require('./config/mongoose'); // require the database

// used for session cookies
const session = require("express-session");
const passport = require('passport');
const passportLocal = require('./config/passport_local');

// Setting up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(expressLayout);
app.use(bodyParser.urlencoded({ extended: false })); // since express does not have bodyParser with it, so we have to download, and use it as middleware

app.use(express.static('./assets'));

// mongo store is used to store the session cookie
app.use(session({
    name: 'codeial',
    // TODO: change the secret before deployment in production mode
    secret: "habitTracker",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    }
}));

// Using passport
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

// Using Connect flash
app.use(flash());
app.use(flashMiddleware.setFlash); // Apply the flash middleware to capture messages

app.use('/' , require('./routes/index')); // middleware for router

// directing the app to the given port
app.listen(port, function(err) {
    if (err) {
        console.log(err);
        return;
    }
    
    console.log(`Server is up and running on port ${port}`);
});
