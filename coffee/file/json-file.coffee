
ObjFile = require '../file'


class JsonFile extends ObjFile

  @decode: (raw, cb) ->
    try
      cb null, JSON.parse raw
    catch err
      cb err

  @encode: (data, cb) ->
    try
      cb null, JSON.stringify data, null, 2
    catch err
      cb err


module.exports = JsonFile
