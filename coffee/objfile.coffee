
IniFile  = require './file/ini-file'
JsonFile = require './file/json-file'


module.exports = (path, opts, cb) ->
  if not cb and typeof opts is 'function'
    [cb, opts] = [opts, {}]

  opts ?= {}
  if typeof opts isnt 'object'
    throw new Error 'options must be object: objfile(path, options, callback)'

  if opts.type?
    unless opts.type in ['ini', 'json']
      throw new Error 'options.type must be either \'ini\', \'json\' or undefined'
  else
    if String(path).toLowerCase().split('.').pop() is 'ini'
      opts.type = 'ini'
    else
      opts.type = 'json'

  if opts.type is 'ini'
    return new IniFile path, opts, cb
  else
    return new JsonFile path, opts, cb


module.exports.IniFile  = IniFile
module.exports.JsonFile = JsonFile
