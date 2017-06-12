const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let UserSchema = new mongoose.Schema( {
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator:  validator.isEmail,
      message: `{VALUE} is not a valid name!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

UserSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  return { _id,  email } = userObject;
}


UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;

  return User.findOne({email}).then((user) => {
    if(!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if(err) {
          reject(err);
        }

        if(!res) {
          resolve(false);
        }

        resolve(user);
      });
    })

  })
}

UserSchema.pre('save', function (next) {
  var user = this;
  if(user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      if(err) {
        next(err);
      }

      bcrypt.hash(user.password, salt, (err, hash) => {
        if(err) {
          next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
})

let User = mongoose.model('User', UserSchema);

module.exports = {User};
