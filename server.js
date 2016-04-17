'use strict';

/* COMMAND LINE CHAT SERVER */
// This is a basic proof of concept so far

// require dependencies
const express =  require('express');
const app =      express();
const mongoose = require('mongoose');
const morgan =   require('morgan');

const User = require('./app/models/user');
const port = process.env.PORT || 8000;


let welcome = "-----Welcome to CLI CHAT-----\n" +
              "If you are a new user, enter `new`.\n" +
              "If you have an existing username, enter `login`\n" +
              "> ";

app.get('/', function(req, res) {
  console.log(req.body);
  res.send(welcome);
  
});

app.listen(port, function() {
  console.log('Listening on port 8000...');
});