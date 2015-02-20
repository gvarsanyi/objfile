
# npm dependency
ini = require 'ini'

# local dependency
ObjFile = require '../file'


class IniFile extends ObjFile

  @decode: (raw, cb) ->
    try
      cb null, ini.parse raw
    catch err
      cb err

  @encode: (data, cb) ->
    try
      cb null, ini.stringify data, whitespace: true
    catch err
      cb err


module.exports = IniFile
