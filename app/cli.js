'use strict';

const http = require('http');

const host = "http://localhost:8000/";
const stdin = process.stdin, stdout = process.stdout;

http.get(host, function(res) {
  res.on('data', function(chunk) {
    stdout.write(chunk);
    res.resume();
  });
}).on('error', function(err) {
  console.log('ERROR: ' + err);
});


/*

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
// TODO get this to interface with the User model
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
});*/