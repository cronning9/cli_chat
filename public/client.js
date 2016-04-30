'use strict';

const http = require('http');
const request = require('request');

const config = "../config.js";
const host = "http://localhost:8000";

const stdin = process.stdin, stdout = process.stdout;
const prompt = '\n> ';

// logged-in status is stored on the client.
let loggedIn = false;

// -------HELPER FUNCTIONS-------
// Helper function to ask the user a question and accept input with stdin
function acceptInput(question, callback) {

  stdin.resume();
  stdout.write(question + prompt);

  stdin.once('data', function (data) {
    let input = data.toString().trim();
    callback(input);
  });
}

// Helper function to handle user input. Passes in handlers, and accepts a callback
// to handle invalid input.
function handleInput(input, handlers, onFail) {
  if (input in handlers) {
    handlers[input]();
  } else {
    console.log("Invalid entry");
    onFail();
  }
}

// -------------------------

// opening request -- wrapped in function to allow recursion
// in case of invalid input

function begin() {
  request(host, function (error, response, body) {
    acceptInput(body, function (input) {
      handleInput(input, {
        'new': newUser,
        'login': login,
        'quit': exit
      }, begin);
    });
  });
}


function newUser() {
  
  acceptInput("Select a username", function(username) {
    acceptInput("Select a password", function(password) {
      let options = {
        uri: host + '/users',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          'username': username,
          'password': password
        },
        json: true
      };

      request(options, function (error, response, body) {
        if (error) {
          console.log(Error("Entry invalid") + response.statusCode);
          exit(1);
          
        } else if (response.statusCode == 401) {
          
          acceptInput(body, function(input) {
            handleInput(input, {
              'new': newUser,
              'login': login,
              'quit': exit
            }, newUser);
          });
        } else if (response.statusCode != 200) {
          console.log(Error(error + response.statusCode));
          exit(1);
          
        } else {
          console.log(body);
          // enter chat from here
          exit();
        }
      });
    });
  });
  
}

function login() {

  // ask for username and password
  acceptInput("Enter your username", function(username) {
    acceptInput("Enter your password", function(password) {
      let options = {
        uri: host + '/users/authenticate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          'username': username,
          'password': password
        },
        json: true
      };
      
      request(options, function(error, response, body) {

        if (error) { console.log(Error("Invalid request" + error.statusCode)); }
      
        if (response.body.success == false) {
          console.log(body.message);
          acceptInput("Maybe consider signing up with a new username.\n" +
                      "To do that, enter `new`.\n" +
                      "To continue trying to log in, type `login`", function(input) {
            handleInput(input, {
              'new': newUser,
              'login': login,
              'quit': exit
              }, begin);
          });
        } else {
          loggedIn = true;
          console.log(body.message);
          // will move to chat from here
          exit(0);
        }
      });
    });
  });
}

function exit(code) {
  console.log("Goodbye!");
  process.exit(code);
}

// begin with request to host
begin();