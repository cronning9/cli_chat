'use strict';

const User = require('../app/models/user');
const express = require('express');

module.exports = function() {
  const userRouter = express.Router();
  
  userRouter.route('/')
      // create a new user
    .post(function(req, res) {
      let body = req.body;
      let user = new User();

      user.username = body.username;
      user.password = body.password;

      user.save(function(err) {
        if (err) {
          if (err.code == 11000) {
            res.send(401, "This username already exists.\n" +
                "To login with this username, type `login`.\n" +
                "To try another name, enter `new`.");
          } else {
            res.send(err);
          }
        } else {
          res.send("User " + user.username + " created.")
        }
      });
    });
  
  return userRouter;
  
};