var request = require('supertest');
var assert = require('assert');
var expect = require('chai').expect;

var app = require('../dikio');

describe('Test language detection', function () {
    it('responds to /api/languages/english-french-german/pain', function (done) {
      request(app)
        .get('/api/languages/english-french-german/pain')
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            expect(res.body).to.be.an('array');
            assert.equal(res.body[0].code, 'fr', 'should be french');
            done();
        });
    });
});
