'use strict';

/* COMMAND LINE CHAT SERVER */
// This is a basic proof of concept so far

// require dependencies
const express =  require('express');
const app =      express();
const mongoose = require('mongoose');
const morgan =   require('morgan');

const User = require('.app/models/user');
const port = process.env.PORT || 8000;


// Helper function to ask the user a question and accept input with stdin
function acceptInput(question, callback) {
  const stdin = process.stdin, stdout = process.stdout;

  stdin.resume();
  stdout.write(question + " > ");

  stdin.once('data', function(data) {
    let input = data.toString().trim();
    callback(input);
  });
}

// Sample to allow the user to create a username and login
acceptInput("Select a username", function(name) {
  let username = name;
  if (users[username]) {
    acceptInput("Enter password", function(password) {
      //authentication will happen here
      console.log("Hey you signed in, " + username);
    });
  } else {
    acceptInput("I see that you are a new user.\nCreate a password", 
        function(password) {
          users[username] = {};
          users[username].username = username;
          users[username].password = password;
          
          console.log(users);
          process.exit(0);
        });
  }
});

