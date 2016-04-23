// ------------------------
// TODO Move this to a ./public/app folder
// TODO set login stuff into ./public/app/controller
'use strict';

const http = require('http');
const request = require('request');

const config = "../config.js";
const host = "http://localhost:8000";

const stdin = process.stdin, stdout = process.stdout;
const prompt = '\n> ';

// TODO figure out proper else condition on line 21 and 68

// opening request -- wrapped in function to allow recursion
// in case of invalid input
function begin(host) {
  request(host, function (error, response, body) {

    acceptInput(body, function (input) {
      // perhaps this should eventually be moved to global scope to be called
      // in various functions
      let handlers = {
        'new': newUser,
        'login': login
      };

      if (input in handlers) {
        handlers[input]();
        
      } else {
        console.log("Invalid entry");
        begin(host);
      }
    });
  });
}

// begin with request to host
begin(host);

// Helper function to ask the user a question and accept input with stdin
function acceptInput(question, callback) {

  stdin.resume();
  stdout.write(question + prompt);

  stdin.once('data', function (data) {
    let input = data.toString().trim();
    callback(input);
  });
}

function newUser() {
  // define options with a blank body to be defined shortly

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
          console.log(Error(error) + response.statusCode);
          
        } else if (response.statusCode == 401) {
          
          acceptInput(body, function(input) {
            let handlers = {
              'new': newUser,
              'login': null
            };

            if (input in handlers) {
              handlers[input]();
              begin();
            } else {
              console.log("Invalid entry");
              begin();
            }
          });
          
        } else if (response.statusCode != 200) {
          console.log(Error("Invalid request: " + response.statusCode));
          
        } else {
          console.log(body);
          // enter chat from here
          process.exit(0);
        }
      });
    });
  });
  
}

function login() {
  console.log("Login function");
  begin(host);
}


// Sample to allow the user to create a username and login
// TODO make this work
/*function login(user) {
  acceptInput("Select a username", function (name) {
    let users = {};
    let username = name;
    if (users[username]) {
      acceptInput("Enter password", function (password) {
        //authentication will happen here
        console.log("Hey you signed in, " + username);
      });
    } else {
      acceptInput("I see that you are a new user.\nCreate a password",
          function (password) {
            console.log("roger that, logged in");
            users[username] = {};
            users[username].username = username;
            users[username].password = password;

            console.log(users);
            process.exit(0);
          });
    }
  });
}*/