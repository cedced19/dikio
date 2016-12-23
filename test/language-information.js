var request = require('supertest');
var assert = require('assert');
var expect = require('chai').expect;

var app = require('../dikio');

describe('Test language detection', function () {
    it('responds to a bad request', function (done) {
      request(app)
        .get('/api/language/wtf')
        .expect(400)
        .end(function(err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('errorMessage');
            done();
        });
    });
    it('responds to /api/language/de', function (done) {
      request(app)
        .get('/api/language/de')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('code');
            assert.equal(res.body.code, 'de', 'should be the language code (iso-639-1)');
            expect(res.body).to.have.property('name');
            assert.equal(res.body.name, 'german', 'should be the language name in english');
            done();
        });
    });
    it('responds to /api/language/german', function (done) {
      request(app)
        .get('/api/language/de')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('code');
            assert.equal(res.body.code, 'de', 'should be the language code (iso-639-1)');
            expect(res.body).to.have.property('name');
            assert.equal(res.body.name, 'german', 'should be the language name in english');
            done();
        });
    });
});
