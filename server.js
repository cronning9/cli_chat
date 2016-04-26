'use strict';

/* COMMAND LINE CHAT SERVER */
// This is a basic proof of concept so far

// require dependencies
const express =  require('express');
const app =      express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const morgan =   require('morgan');

const config = require('./config');
const userRouter = require('./routes/users')(app, express);

let welcome = "-----Welcome to CLI CHAT-----\n" +
              "If you are a new user, enter `new`.\n" +
              "If you have an existing username, enter `login`.\n" +
              "Enter `quit` at any time to quit.";

mongoose.connect(config.database);

app.use(bodyParser.json());
app.use(morgan('dev'));

// ----- ROUTES ------

//  home route -- initial entry to app
app.get('/', function(req, res) {
  res.send(welcome);
  
});

// users route
app.use('/users', userRouter);

// ladies and gentlemen, start your engines!
app.listen(config.port, function() {
  console.log('Listening on port 8000...');
});