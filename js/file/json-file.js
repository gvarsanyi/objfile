// Generated by CoffeeScript 1.9.1
var JsonFile, ObjFile,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ObjFile = require('../file');

JsonFile = (function(superClass) {
  extend(JsonFile, superClass);

  function JsonFile() {
    return JsonFile.__super__.constructor.apply(this, arguments);
  }

  JsonFile.decode = function(raw, cb) {
    var err;
    try {
      return cb(null, JSON.parse(raw));
    } catch (_error) {
      err = _error;
      return cb(err);
    }
  };

  JsonFile.encode = function(data, cb) {
    var err;
    try {
      return cb(null, JSON.stringify(data, null, 2));
    } catch (_error) {
      err = _error;
      return cb(err);
    }
  };

  return JsonFile;

})(ObjFile);

module.exports = JsonFile;
