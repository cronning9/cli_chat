'use strict';

const http = require('http');
const request = require('request');

const config = "../config.js";
const host = "http://localhost:8000";

const stdin = process.stdin, stdout = process.stdout;
const prompt = '\n> ';

http.get(host, function(res) {
  res.on('data', function(chunk) {
    let response = stdout.write(chunk);
    acceptInput(response, function(input) {
      if (input == 'new') {
        newUser();
      } else if (input == 'login') {
        login();
      }
    });
    
  });
}).on('error', function(err) {
  console.log('ERROR: ' + err);
});

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
      console.log(username + " > " + password);
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
        console.log(options);
        if (error) {
          console.log(Error(error));
        } else if (response.statusCode != 200) {
          console.log(Error("Invalid request: " + response.statusCode))
        } else {
          console.log(body);
        }
      });
    });
  });
  
}
// THIS WILL NOT WORK
// TODO: make it work
/*function newUser() {
  let userInfo = Promise(function(reject, resolve) {

    acceptInput("Select a username", function(username) {

      acceptInput("Select a password", function(password) {

        return { 'username' : username,
          'password' : password };

      });
    });
    let options = {
      uri: host + '/users',
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: userInfo
    };
    reject(console.log("something went wrong"));

    resolve(return options);
  };

  userInfo.then(request(options, function(error, response, body) {
    if (error) {
      console.log('Error:' + error);
    } else if (response.statusCode != 200) {
      console.log("Invalid request")
    } else {
      console.log(body);
    }
  }));

}*/
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