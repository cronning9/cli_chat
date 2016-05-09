'use strict';

const http = require('http');


const config = require("../config.js");
const host = "http://localhost:" + config.port;

const stdin = process.stdin, stdout = process.stdout;
const prompt = '\n> ';


function Login() {
  this.username = undefined;
  this.admin = false;
  this.loggedIn = false;
  this.options = {};
  this.userSession = {
    username: undefined,
    admin: false
  };
}

//---------------------HELPER FUNCTIONS----------------------
// set on the Login prototype in order to
// pass instance variables, keep 'this' scope, etc
Login.prototype.handleInput = function(input) {
  let self = this;
  if (input == 'new') {
    self.newUser();
  } else if (input == 'login') {
    self.login();
  } else if (input == 'quit') {
    self.exit(0);
  } else {
    self.begin();
  }
};

Login.prototype.acceptInput = function(question, callback) {

  stdin.resume();
  stdout.write(question + prompt);

  stdin.once('data', function (data) {
    let input = data.toString().trim();
    callback(input);
  });
};

// ---------------------------------------------

Login.prototype.request = require('request');


Login.prototype.begin = function() {
  //let err, resp, respBody;
  let self = this;
  self.request(host, function(error, response, body) {
    if (error) throw error;
    self.acceptInput(body, function (input) {
      self.handleInput(input);
    });
  })
  
};

Login.prototype.newUser = function() {
  // so somehow, this and self refer to the handlers objects passed to 
  // self.handleInput. Jesus...
  let self = this;
  self.acceptInput("Select a username", function(username) {
    self.acceptInput("Select a password", function(password) {
      self.options = {
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
      
      self.request(self.options, function(error, response, body) {
        // if we've got an error
        if (error) {
          console.log(Error("Entry invalid") + response.statusCode);
          self.exit(1);
          // if the username already exists
        } else if (response.statusCode == 401) {
          acceptInput(body, function(input) {
            self.handleInput(input);
          });
          // if there's some other error from the server
        } else if (response.statusCode != 200) {
          console.log(Error(error + response.statusCode));
          self.exit(1);
          // if everything is valid
        } else {
          console.log(body);
          // enter chat from here
          self.exit(0);
        }
      });
    });
  });
};

Login.prototype.login = function() {
  let self = this;

  self.acceptInput("Enter your username", function(username) {
    self.acceptInput("Enter your password", function(password) {
      self.options = {
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

      self.request(self.options, function(error, response, body) {
        if (error) {
          console.log(Error("Invalid request" + error.statusCode));
          self.exit(1);
        }
        if (response.body.success == false) {
          console.log(body.message);
          self.acceptInput("Maybe consider signing up with a new username.\n" +
              "To do that, enter `new`.\n" +
              "To continue trying to log in, type `login`", function(input) {
            self.handleInput(input);
          });
        } else {
          self.loggedIn = true;
          self.userSession.username = self.options.body.username;
          console.log(body.message);
          console.log("You are now logged in as " + self.userSession.username);
          // will move to chat from here
          self.exit(0);
        }
      })
    })
  })
};

Login.prototype.exit = function(code) {
  console.log('Goodbye!');
  process.exit(code);
};

module.exports = Login;