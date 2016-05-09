'use strict';

const http = require('http');
const request = require('request');

const Login = require('./loginStart');
const config = require("../config.js");

const login = new Login();

login.begin();