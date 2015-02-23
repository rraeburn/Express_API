'use strict';

process.env.MONGO_URI = 'mongodb://localhost/villainsapp_test';
require('../server.js');

var chai = require('chai');
var chaihttp = require('chai-http');
var mongoose = require('mongoose');

chai.use(chaihttp);

var expect = chai.expect;
var testToken;

describe('villains api endpoints', function() {
  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  before(function(done) {
    chai.request('localhost:3000/api/v1')
      .post('/create_user')
      .send({email: 'test@test', password: 'test'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        testToken = res.body.token;
        done();
      });
  });

  it('should respond to post', function(done) {
    chai.request('localhost:3000/api/v1')
    .post('/villains')
    .send({ eat: testToken, realName: 'Guy McTest', superName: 'MadTester', publisher: 'testpeople'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body).to.have.property('_id');
      expect(res.body.realName).to.eql('Guy McTest');
      expect(res.body.superName).to.eql('MadTester');
      expect(res.body.publisher).to.eql('testpeople');
      done();
    });
  });

  it('should have default realName', function(done) {
    chai.request('localhost:3000/api/v1')
    .post('/villains')
    .send({eat: testToken, superName: 'TestMan', publisher: 'Testers'})
    .end(function(err, res) {
      expect(err).to.eql(null);
      expect(res.body.realName).to.eql('Unknown');
      done();
    });
  });

  describe('has info in db', function() {
    var id;

    beforeEach(function(done) {
      chai.request('localhost:3000/api/v1')
      .post('/villains')
      .send({eat: testToken, superName: 'Testzilla', publisher: 'TestGuy'})
      .end(function(err, res) {
        id = res.body._id;
        done();
      });
    });
  
    it('should have an index', function(done) {
      chai.request('localhost:3000/api/v1')
      .get('/villains/')
      .send({eat:testToken})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(Array.isArray(res.body)).to.eql(true);
        expect(res.body[0]).to.have.property('realName');
        done();
      });
    });

    it('should update a villain', function(done) {
      chai.request('localhost:3000/api/v1')
      .put('/villains/' + id)
      .send({eat: testToken, superName: 'Professor Test', publisher: 'Test Labs'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.superName).to.eql('Professor Test');
        expect(res.body.publisher).to.eql('Test Labs');
        done();
      });
    });

    it('should delete a villain', function(done) {
      chai.request('localhost:3000/api/v1')
      .delete('/villains/' + id)
      .send({eat:testToken})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect((res.body)[0]._id).to.eql(id);
        done();
      });
    });
  });

});
