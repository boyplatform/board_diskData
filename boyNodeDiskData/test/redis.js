var expect = require("chai").expect;
var cache = require('../')('redis', {
  url: '//127.0.0.1'
});

describe('nodejs-cache', function() {
  describe('Redis', function() {
    it('should set a value', function(done) {
      cache.set("key", "value", {
        ttl: 10
      }, (err, ok) => {
        if (err) {
          console.log(err)
          expect(err).to.not.be.ok
          done();
          return;
        }
        expect(ok).to.equal("OK");
        done();
      })
    });

    it('should get a value', function(done) {
      cache.get('key', (err, value) => {
        if (err) {
          console.log(err)
          expect(err).to.not.be.ok
          done();
          return;
        }

        expect(value).to.equal("value");
        done();
      })
    });

    it('should delete the value', function(done) {
      cache.del('key', (err, ok) => {
        if (err) {
          console.error(err);
          expect(err).to.not.be.ok
          done();
          return;
        }
        expect(ok).to.equal(1);
        done();
      })
    });
  });
});
