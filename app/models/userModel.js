'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let UserSchema = new Schema ({
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true, select: false},
  admin: {type: Boolean, default: false}
});

// hash the password
UserSchema.pre('save', function(next) {
  let user = this;

  // hash the password only if the password has been changed or user is new
  if (!user.isModified('password')) return next();

  // generate hash
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if (err) return next(err);

    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function(password) {
  let user = this;
  
  return bcrypt.compareSync(password, user.password);
};

const User = mongoose.model('User', UserSchema);
module.exports = User;