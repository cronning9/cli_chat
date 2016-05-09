'use strict';

const http = require('http');
const request = require('request');

const config = require("../config.js");
const host = "http://localhost:" + config.port;

const stdin = process.stdin, stdout = process.stdout;
const prompt = '\n> ';

// ----HELPER FUNCTIONS----

// accepts user input and allows something to be done with it
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

// This whole thing feels like it should be running with prototypes. However,
// it doesn't work unless all of the methods are defined directly on LoginClient.

// furthermore, session.begin() in client.js won't work unless it is defined
// on the prototype here. This is weird. 
/*let LoginClient = {
  loggedIn: false, 
  userSession: {
    'username': undefined,
    'admin': false
  }
};*/

function LoginClient() {
  this.loggedIn = false;
  this.userSession =  {
    username: 'fuck',
    admin: false
  };
}

LoginClient.handleInput = function(input, handlers, onFail) {
  if (input in handlers) {
    handlers[input]();
  } else {
    console.log("Invalid entry");
    onFail();
  }
};

  // opening request -- wrapped in function to allow recursion
  // in case of invalid input
LoginClient.prototype.begin = function() {
  console.log(this.userSession.username);
  request(host, function (error, response, body) {
    acceptInput(body, function (input) {
      LoginClient.handleInput(input, {
        'new': this.newUser,
        'login': LoginClient.login,
        'quit': LoginClient.exit
      }, LoginClient.begin);
    });
  });
};


LoginClient.newUser = function() {

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
          LoginClient.exit(1);

        } else if (response.statusCode == 401) {

          acceptInput(body, function(input) {
            LoginClient.handleInput(input, {
              'new': LoginClient.newUser,
              'login': LoginClient.login,
              'quit': LoginClient.exit
            }, LoginClient.newUser);
          });
        } else if (response.statusCode != 200) {
          console.log(Error(error + response.statusCode));
          LoginClient.exit(1);

        } else {
          console.log(body);
          // enter chat from here
          LoginClient.exit(0);
        }
      });
    });
  });

};

LoginClient.login = function(){

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
            LoginClient.handleInput(input, {
              'new': LoginClient.newUser,
              'login': LoginClient.login,
              'quit': LoginClient.exit
            }, LoginClient.begin);
          });
        } else {
          console.log(this.loggedIn);
          this.loggedIn = true;
          this.userSession.username = options.username;
          console.log(this.userSession);
          console.log(this.loggedIn);
          console.log(body.message);
          // will move to chat from here
          LoginClient.exit(0);
        }
      });
    });
  });

};

LoginClient.exit = function(code) {

  console.log("Goodbye!");
  process.exit(code);
};

module.exports = LoginClient;