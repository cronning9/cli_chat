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
function begin() {
  request(host, function (error, response, body) {

    acceptInput(body, function (input) {
      let handlers = {
        'new': newUser(),
        'login': null
      };

      if (input in handlers) {
        return handlers[input];
      } else {
        console.log("Invalid entry");
        begin();
      }
    });
  });
}
begin();

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
          // -------
          /*
          The following chunk is going to happen frequently, with different 
          possible inputs. Maybe alter acceptInput, or create another helper
          function to pass it through.
          // TODO figure out potential way to store a general-purpose question function
           -------*/
          acceptInput(stdout.write(body), function(input) {
            let handlers = {
              'new': newUser(),
              'login': null
            };

            if (input in handlers) {
              return handlers[input];
            } else {
              console.log("Invalid entry");
              begin();
            }
          });
        } else if (response.statusCode != 200) {
          console.log(Error("Invalid request: " + response.statusCode))
        } else {
          console.log(body);
        }
      });
    });
  });
  
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