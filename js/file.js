// Generated by CoffeeScript 1.9.1
var ObjFile, fs, loaded_files, mkdirp, path,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  slice = [].slice,
  hasProp = {}.hasOwnProperty;

fs = require('fs');

path = require('path');

mkdirp = require('mkdirp');

loaded_files = {};

ObjFile = (function() {
  ObjFile.prototype._objFileAllData = null;

  ObjFile.prototype._objFileCue = null;

  ObjFile.prototype._objFileData = null;

  ObjFile.prototype._objFileError = null;

  ObjFile.prototype._objFileOptions = null;

  ObjFile.prototype._objFilePath = null;

  ObjFile.prototype._objFileReading = null;

  ObjFile.prototype._objFileWriting = null;

  function ObjFile(source_path, opts, cb) {
    this.set = bind(this.set, this);
    this.get = bind(this.get, this);
    this.del = bind(this.del, this);
    this._objFileWrite = bind(this._objFileWrite, this);
    this._objFileRead = bind(this._objFileRead, this);
    this._objFileLoad = bind(this._objFileLoad, this);
    this._objFileLoad(source_path, opts, cb);
  }

  ObjFile.prototype._objFileLoad = function(source_path, opts, cb) {
    var i, item, j, len, len1, ref, target;
    if (!cb && typeof opts === 'function') {
      ref = [opts, {}], cb = ref[0], opts = ref[1];
      this._opts;
    }
    if (opts == null) {
      opts = {};
    }
    if (typeof opts !== 'object') {
      throw new Error('options must be object: ' + 'ObjFile::_objFileLoad(path, options, callback)');
    }
    if ((this._objFilePath != null ? this._objFilePath : this._objFilePath = source_path) !== source_path) {
      return typeof cb === "function" ? cb(new Error('source_path does not match previously set path')) : void 0;
    }
    if (this._objFileCue == null) {
      this._objFileCue = [];
    }
    if (this._objFileOptions == null) {
      this._objFileOptions = opts;
    }
    if ((target = opts.expose) && typeof opts.expose === 'object') {
      if (!Array.isArray(target)) {
        target = [target];
      }
      for (i = 0, len = target.length; i < len; i++) {
        item = target[i];
        if (!(item && typeof item === 'object')) {
          continue;
        }
        item.get = (function(_this) {
          return function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return _this.get.apply(_this, args);
          };
        })(this);
        item.set = (function(_this) {
          return function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return _this.set.apply(_this, args);
          };
        })(this);
        item.del = (function(_this) {
          return function() {
            var args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return _this.del.apply(_this, args);
          };
        })(this);
      }
    }
    if ((target = opts.exposeGet) && typeof opts.exposeGet === 'object') {
      if (!Array.isArray(target)) {
        target = [target];
      }
      for (j = 0, len1 = target.length; j < len1; j++) {
        item = target[j];
        if (item && typeof item === 'object') {
          item.get = (function(_this) {
            return function() {
              var args;
              args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
              return _this.get.apply(_this, args);
            };
          })(this);
        }
      }
    }
    return setTimeout((function(_this) {
      return function() {
        return _this._objFileRead(cb);
      };
    })(this));
  };

  ObjFile.prototype._objFileRead = function(cb) {
    var process;
    process = (function(_this) {
      return function() {
        var error, ready, root;
        _this._objFileError = null;
        _this._objFileReading = true;
        error = function(err) {
          var base;
          _this._objFileError = typeof err === 'string' ? new Error(err) : err;
          _this._objFileReading = false;
          if (typeof cb === "function") {
            cb(_this._objFileError);
          }
          return typeof (base = _this._objFileCue.shift()) === "function" ? base() : void 0;
        };
        ready = function() {
          _this._objFileReading = false;
          return setTimeout(function() {
            var base;
            if (typeof cb === "function") {
              cb();
            }
            return typeof (base = _this._objFileCue.shift()) === "function" ? base() : void 0;
          });
        };
        if (!_this._objFilePath) {
          return error('File source path missing');
        }
        if (_this._objFileAllData) {
          return ready();
        }
        _this._objFileAllData = {};
        if (root = _this._objFileOptions.dataRoot) {
          _this._objFileData = _this._objFileAllData[root] = {};
        } else {
          _this._objFileData = _this._objFileAllData;
        }
        return fs.readFile(_this._objFilePath, {
          encoding: 'utf8'
        }, function(err, data) {
          if (!err) {
            return _this.constructor.decode(data, function(err, pkg) {
              var _err, key, ref, value;
              if (err) {
                return error(err);
              }
              try {
                ref = _this._objFileAllData;
                for (key in ref) {
                  if (!hasProp.call(ref, key)) continue;
                  delete _this._objFileAllData[key];
                }
                for (key in pkg) {
                  value = pkg[key];
                  _this._objFileAllData[key] = value;
                }
                if (root) {
                  if (!(_this._objFileAllData[root] && typeof _this._objFileAllData[root] === 'object')) {
                    _this._objFileData = _this._objFileAllData[root] = {};
                    return _this._objFileWrite(function(err) {
                      if (err) {
                        return error(err);
                      }
                      return ready();
                    });
                  } else {
                    _this._objFileData = _this._objFileAllData[root];
                  }
                } else {
                  _this._objFileData = _this._objFileAllData;
                }
              } catch (_error) {
                _err = _error;
                return ready(_err);
              }
              return ready();
            });
          }
          return ready();
        });
      };
    })(this);
    if (this._objFileError) {
      if (typeof cb === "function") {
        cb(this._objFileError);
      }
    } else if (this._objFileReading || this._objFileWriting) {
      this._objFileCue.push(process);
    } else {
      process(cb);
    }
  };

  ObjFile.prototype._objFileWrite = function(cb) {
    var error;
    error = (function(_this) {
      return function(err) {
        var base;
        _this._objFileError = typeof err === 'string' ? new Error(err) : err;
        _this._objFileWriting = false;
        if (typeof cb === "function") {
          cb(_this._objFileError);
        }
        return typeof (base = _this._objFileCue.shift()) === "function" ? base() : void 0;
      };
    })(this);
    this._objFileRead((function(_this) {
      return function(err) {
        var process;
        if (err) {
          return error(err);
        }
        process = function() {
          _this._objFileWriting = true;
          return _this.constructor.encode(_this._objFileAllData, function(err, str) {
            if (err) {
              return error(err);
            }
            return mkdirp(path.dirname(_this._objFilePath), {
              mode: '0755'
            }, function(err) {
              if (err) {
                return error(err);
              }
              return fs.writeFile(_this._objFilePath, str, {
                encoding: 'utf8'
              }, function(err) {
                var base;
                if (err) {
                  return error(err);
                }
                _this._objFileWriting = false;
                if (typeof cb === "function") {
                  cb();
                }
                return typeof (base = _this._objFileCue.shift()) === "function" ? base() : void 0;
              });
            });
          });
        };
        if (_this._objFileError) {
          return typeof cb === "function" ? cb(_this._objFileError) : void 0;
        } else if (_this._objFileReading || _this._objFileWriting) {
          return _this._objFileCue.push(process);
        } else {
          return process();
        }
      };
    })(this));
  };

  ObjFile.prototype.del = function() {
    var cb, i, level_names, name;
    level_names = 3 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 2) : (i = 0, []), name = arguments[i++], cb = arguments[i++];
    return this._objFileRead((function(_this) {
      return function(err) {
        var j, len, level_name, target;
        if (err) {
          return typeof cb === "function" ? cb(err) : void 0;
        }
        target = _this._objFileData;
        for (j = 0, len = level_names.length; j < len; j++) {
          level_name = level_names[j];
          if (!(target[level_name] && typeof target[level_name] === 'object')) {
            target[level_name] = {};
          }
          target = target[level_name];
        }
        delete target[name];
        return _this._objFileWrite(cb);
      };
    })(this));
  };

  ObjFile.prototype.get = function() {
    var cb, i, level_names, name;
    level_names = 3 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 2) : (i = 0, []), name = arguments[i++], cb = arguments[i++];
    if (typeof cb !== 'function') {
      throw new Error('Callback function is required');
    }
    return this._objFileRead((function(_this) {
      return function(err) {
        var j, len, level_name, target, undefined_key;
        if (err) {
          return typeof cb === "function" ? cb(err) : void 0;
        }
        undefined_key = function() {
          return typeof cb === "function" ? cb(new Error('Undefined: ' + level_names.concat([name]).join('.'))) : void 0;
        };
        target = _this._objFileData;
        for (j = 0, len = level_names.length; j < len; j++) {
          level_name = level_names[j];
          if (!(target[level_name] && typeof target[level_name] === 'object')) {
            return undefined_key();
          }
          target = target[level_name];
        }
        if (!target.hasOwnProperty(name)) {
          return undefined_key();
        }
        return cb(null, target[name]);
      };
    })(this));
  };

  ObjFile.prototype.set = function() {
    var cb, i, level_names, name, value;
    level_names = 4 <= arguments.length ? slice.call(arguments, 0, i = arguments.length - 3) : (i = 0, []), name = arguments[i++], value = arguments[i++], cb = arguments[i++];
    return this._objFileRead((function(_this) {
      return function(err) {
        var j, len, level_name, target;
        if (err) {
          return typeof cb === "function" ? cb(err) : void 0;
        }
        target = _this._objFileData;
        for (j = 0, len = level_names.length; j < len; j++) {
          level_name = level_names[j];
          if (!(target[level_name] && typeof target[level_name] === 'object')) {
            target[level_name] = {};
          }
          target = target[level_name];
        }
        target[name] = value;
        return _this._objFileWrite(cb);
      };
    })(this));
  };

  return ObjFile;

})();

module.exports = ObjFile;
