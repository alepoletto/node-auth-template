const {passport} = require('../services/passport');
const {User} = require('../models/user');
const jwt = require('jsonwebtoken');

const requireAuth = passport.authenticate('jwt', { session: false});
const requireSignin= passport.authenticate('local', { session: false});

function tokenForUser(user){
  const timestamp = new Date().getTime();
  let acess = 'auth';
  let token = jwt.sign({sub: user._id.toHexString(), iat:timestamp, acess}, process.env.JWT_SECRET).toString();
  return token;
}

module.exports = (app) => {

  app.post('/signup', (req, res) => {
    console.log(req.body);
    const { email, password} = req.body;

    if(!email || !password){
      return res.status(422).send({error: 'You must provide an email and a password!'})
    }

    User.findOne({email}).then((existingUser) => {
      console.log(existingUser);
      if(existingUser) {
        console.log('vaza');
        return res.status(422).send({error: 'Email is in use'});
      }
    }).catch(e => {
      return res.status(400).send({error: e});
    });

    let user = new User({ email, password});
    user.save().then((doc) => {
      res.send({token: tokenForUser(user)})
    }).catch(e => {
      console.log(e);
      return res.status(400).send({error: e})
    });

  });

  app.post('/signin', requireSignin, (req, res, next) => {
    res.send({token: tokenForUser(req.user)});
  });

  app.get('/',requireAuth, (req,res) => {
    res.send({message: 'ola'})
  });

}
