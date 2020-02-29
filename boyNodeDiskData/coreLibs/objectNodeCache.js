'use strict'

function Obj(url) {
	this.cacheObj = {};
}

Obj.prototype.constructor=Obj;

Obj.prototype.set = function(key, value, options, callback) {

	this.cacheObj[key] = value;

	// Set TTL
	if (options.ttl) {
		setTimeout(() => {
			delete this.cacheObj[key];
		}, options.ttl*1000)
	}
	return callback(null, "OK");
};

Obj.prototype.get = function(key, callback) {
	var value = this.cacheObj[key];
	return callback(null, value);
};

Obj.prototype.del = function(key, callback) {
	delete this.cacheObj[key];
	return callback(null, "OK");
};


module.exports = Obj;