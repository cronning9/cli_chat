'use strict';

/* COMMAND LINE CHAT SERVER */
// This is a basic proof of concept so far

// require dependencies
const express =  require('express');
const app =      express();
const mongoose = require('mongoose');
const morgan =   require('morgan');

const config = require('./config');
const User = require('./app/models/user');

let welcome = "-----Welcome to CLI CHAT-----\n" +
              "If you are a new user, enter `new`.\n" +
              "If you have an existing username, enter `login`";

mongoose.connect(config.database);

app.get('/', function(req, res) {
  console.log(req.body);
  res.send(welcome);
  
});

app.route('/users')
    // create a new user
    .post(function(req, res) {
      let user = new User();
      
      user.username = req.body.username;
      user.password = req.body.password;
      
      user.save(function(err) {
        if (err.code == 11000) {
          res.send("This username already exists.\n" +
              "To login with this username, type `login`.\n" +
              "To try another name, enter `new`."); 
        }
          
        
      })
    });

app.listen(config.port, function() {
  console.log('Listening on port 8000...');
});