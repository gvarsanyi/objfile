
# node dependency
fs   = require 'fs'
path = require 'path'

# npm dependency
mkdirp = require 'mkdirp'


loaded_files = {}


class ObjFile

  _objFileAllData: null
  _objFileCue:     null
  _objFileData:    null
  _objFileError:   null
  _objFileOptions: null
  _objFilePath:    null
  _objFileReading: null
  _objFileWriting: null


  constructor: (source_path, opts, cb) ->
    @_objFileLoad source_path, opts, cb


  _objFileLoad: (source_path, opts, cb) =>
    if not cb and typeof opts is 'function'
      [cb, opts] = [opts, {}]
      @_opts

    opts ?= {}
    if typeof opts isnt 'object'
      throw new Error 'options must be object: ' +
                      'ObjFile::_objFileLoad(path, options, callback)'

    if (@_objFilePath ?= source_path) isnt source_path
      return cb? new Error 'source_path does not match previously set path'

    @_objFileCue     ?= []
    @_objFileOptions ?= opts

    setTimeout => # ensure async (return variable assignment happens first)
      @_objFileRead cb


  _objFileRead: (cb) =>
    process = =>
      @_objFileError = null

      @_objFileReading = true

      error = (err) =>
        @_objFileError = if typeof err is 'string' then (new Error err) else err
        @_objFileReading = false
        cb? @_objFileError
        @_objFileCue.shift()?() # flush next in cue

      ready = =>
        @_objFileReading = false
        cb?()
        @_objFileCue.shift()?() # flush next in cue

      unless @_objFilePath
        return error 'File source path missing'

      if @_objFileAllData
        return ready()

      @_objFileAllData = {}
      if root = @_objFileOptions.dataRoot # TODO: does only 1 level
        @_objFileData = @_objFileAllData[root] = {}
      else
        @_objFileData = @_objFileAllData

      fs.readFile @_objFilePath, encoding: 'utf8', (err, data) =>
        unless err
          return @constructor.decode data, (err, pkg) =>
            if err
              return error err
            try
              for own key of @_objFileAllData
                delete @_objFileAllData[key]
              for key, value of pkg
                @_objFileAllData[key] = value
              if root
                unless @_objFileAllData[root] and
                typeof @_objFileAllData[root] is 'object'
                  @_objFileData = @_objFileAllData[root] = {}
                  return @_objFileWrite (err) ->
                    if err
                      return error err
                    ready()
                else
                  @_objFileData = @_objFileAllData[root]
              else
                @_objFileData = @_objFileAllData
            catch _err
              return ready _err
            ready()
        ready()

    if @_objFileError
      cb? @_objFileError
    else if @_objFileReading or @_objFileWriting
      @_objFileCue.push process
    else
      process cb
    return


  _objFileWrite: (cb) =>
    error = (err) =>
      @_objFileError = if typeof err is 'string' then (new Error err) else err
      @_objFileWriting = false
      cb? @_objFileError
      @_objFileCue.shift()?() # flush next in cue

    @_objFileRead (err) => # re-read first
      if err
        return error err

      process = =>
        @_objFileWriting = true
        @constructor.encode @_objFileAllData, (err, str) =>
          if err
            return error err

          mkdirp path.dirname(@_objFilePath), {mode: '0755'}, (err) =>
            if err
              return error err

            fs.writeFile @_objFilePath, str, encoding: 'utf8', (err) =>
              if err
                return error err

              @_objFileWriting = false
              cb?()
              @_objFileCue.shift()?() # flush next in cue

      if @_objFileError
        cb? @_objFileError
      else if @_objFileReading or @_objFileWriting
        @_objFileCue.push process
      else
        process()
    return


  del: (level_names..., name, cb) =>
    @_objFileRead (err) =>
      if err
        return cb? err

      target = @_objFileData
      for level_name in level_names
        unless target[level_name] and typeof target[level_name] is 'object'
          target[level_name] = {}
        target = target[level_name]

      delete target[name]

      @_objFileWrite cb


  get: (level_names..., name, cb) =>
    unless typeof cb is 'function'
      throw new Error 'Callback function is required'

    @_objFileRead (err) =>
      if err
        return cb? err

      undefined_key = ->
        cb? new Error 'Undefined: ' + level_names.concat([name]).join '.'

      target = @_objFileData
      for level_name in level_names
        unless target[level_name] and typeof target[level_name] is 'object'
          return undefined_key()
        target = target[level_name]

      unless target.hasOwnProperty name
        return undefined_key()

      cb null, target[name]


  set: (level_names..., name, value, cb) =>
    @_objFileRead (err) =>
      if err
        return cb? err

      target = @_objFileData
      for level_name in level_names
        unless target[level_name] and typeof target[level_name] is 'object'
          target[level_name] = {}
        target = target[level_name]
      target[name] = value
      @_objFileWrite cb


module.exports = ObjFile
