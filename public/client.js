'use strict';

const http = require('http');
const request = require('request');

const logins = require('./loginClient.js');
const config = require("../config.js");
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





function exit(code) {
  console.log("Goodbye!");
  process.exit(code);
}

logins.begin();