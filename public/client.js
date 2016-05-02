'use strict';

const http = require('http');
const request = require('request');

const LoginClient = require('./loginClient.js');
const config = require("../config.js");

const session = new LoginClient;

session.begin();