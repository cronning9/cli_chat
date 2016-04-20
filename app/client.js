'use strict';

const http = require('http');

const host = "http://localhost:8000/";

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

  stdin.once('data', function(data) {
    let input = data.toString().trim();
    callback(input);
  });
}

// replace client shit with server responses
function newUser() {
  acceptInput("Select a username", function(name) {
    
    let userInfo = acceptInput("Select a username", function(input) {
      let username = input;
      acceptInput("Select a password", function(input) {
        let password = input;
      });
      return { 'username' : username,
               'password' : password };
    });
    // TODO insert userInfo into post request to create new user
    http.request(options, function(res) {

    });
    // if the user already exists
    if (users[name]) {

      // this will be replaced by server request
      let response = stdout.write("This username already exists.\n" +
                                  "To login with this username, type `login`.\n" +
                                  "To try another name, enter `new`.");
      acceptInput(response, function(input) {
        // login with this name
        if (input == 'login') {
          login(name);
        // try a different username
        } else if (input == 'new') {
          newUser();
        }
      });
    }
    // create new user here
    
  })
}
// Sample to allow the user to create a username and login
// TODO make this work
function login(user) {
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
}