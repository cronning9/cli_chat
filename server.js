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
const User = require('./app/models/user');

let welcome = "-----Welcome to CLI CHAT-----\n" +
              "If you are a new user, enter `new`.\n" +
              "If you have an existing username, enter `login`";

mongoose.connect(config.database);

// express middleware to handle http post requests
app.use(bodyParser.json());
// morgan middleware for logging
app.use(morgan('dev'));

//  home route -- initial exposed route
app.get('/', function(req, res) {
  res.send(welcome);
  
});

// actions on the /users route
app.route('/users')
    // create a new user
    .post(function(req, res) {
      let body = req.body;
      let user = new User();
      
      user.username = body.username;
      user.password = body.password;
      
      user.save(function(err) {
        if (err) {
          if (err.code == 11000) {
            res.send(401, "This username already exists.\n" +
                "To login with this username, type `login`.\n" +
                "To try another name, enter `new`.");
          } else {
            res.send(err);
          }
        } else {
          res.send("User " + user.username + " created.")
        }
      });
    });

// ladies and gentlemen, start your engines!
app.listen(config.port, function() {
  console.log('Listening on port 8000...');
});