const passport = require('passport');
const {User} = require('../models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create a local Strategy
const localOptions = {usernameField: 'email'}
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  //verify this username and password, call done with user if it is the correct,
  //call next with false if its not
  User.findByCredentials(email, password).then((user) => {
    done(null,user);
  }).catch((err) => {
    done(err);
  });

});

//Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.JWT_SECRET
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that other
  // otherwise, call done without a user object
  User.findOne({_id:payload.sub}).then((user) => {
    if(user) {
      done(null,user);
    } else{
      done(null, false);
    }
  }).catch((err) => done(err,false));
})
// Tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);

module.exports= {passport};
