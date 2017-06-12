const expect = require('chai').expect;
const request = require('supertest');
const {ObjectId} = require('mongodb');

const { app } = require('../server');
const {User} = require('../models/user');
const {users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);



  describe('POST /singup', function () {

    it('should create a user', (done) => {
      var email = 'example@example.com';
      var password = '123mnb!';

      request(app)
        .post('/singup')
        .send({email,password})
        .expect(200)
        .expect((res) => {
          expect(res.body.token).to.exist;
        })
        .end((err) => {
          if(err) {
            return done(err);
          }

          User.findOne({email}).then((user) => {
            expect(user).to.exist;
            expect(user.password).to.not.equal(password);
            done();
          }).catch((e) => done(e));
        });
    });

    it('should return validation errors if request invalid', (done) => {
      request(app)
        .post('/users')
        .send({
          email: 'and',
          password: '123'
        })
        .expect(400)
        .end(done);
    });

    it('should not create user  if email in use', (done) => {

      request(app)
        .post('/users')
        .send({
          email: users[0].email,
          password: users[0].password
        })
        .expect(400)
        .end(done);

    });

  describe('POST /users/login', () => {

    it('should login user and return auth token', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: users[1].password
        })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).to.exist;
        })
        .end((err, res) => {
          if(err) {
            return done(err);
          }

          User.findById(users[1]._id).then((user) => {
            expect(user.tokens[1]).to.include({
              acess: 'auth',
              token: res.headers['x-auth']
            });
            done()
          }).catch((e) => done(e));
        })
    });

    it('should reject invalid login', (done) => {
      request(app)
        .post('/users/login')
        .send({
          email: users[1].email,
          password: 'lalalala'
        })
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).to.not.exist;
        })
        .end((err, res) => {
          if(err) {
            return done(err);
          }

          User.findById(users[1]._id).then((user) => {
            expect(user.tokens).to.have.lengthOf(1);
            done()
          }).catch((e) => done(e));
        })
    });
  })


  });
