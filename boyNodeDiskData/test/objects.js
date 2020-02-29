var expect = require("chai").expect;
var cache = require('../')();

describe('nodejs-cache', function () {
  describe('JavaScripts Objects', function() {
    it('should set a value', function(done) {
      cache.set("key", "value", {
        ttl: 10
      }, (err, ok) => {
        if (err) {
          console.log(err)
          expect(err).to.not.be.ok
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
          return;
        }
        expect(ok).to.equal("OK");
        done();
      })
    });
  });
});

