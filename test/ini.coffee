
mkdirp  = require 'mkdirp'
objfile = require '../js/objfile'

error = (msg...) ->
  console.error '[FAIL]', msg...
  process.exit 1


# sync tests

# DESC

f = null

async_tests =
  'init empty INI file': (next) ->
    f = objfile 'tmp/test.ini', (err) ->
      if err
        return error err
      next()

  'write (INI)': (next) ->
    f.set '1', '2', '3', '4', 'hello', (err) ->
      if err
        return error err
      f.set 'x', 'y', 1, (err) ->
        if err
          return error err
        f.set 'a', true, (err) ->
          if err
            return error err
          next()

  'read INI': (next) ->
    f.get '1', '2', '3', '4', (err, value) ->
      if err
        return error err
      unless value is 'hello'
        return error err
      f.get 'x', 'y', (err, value) ->
        if err
          return error err
        unless value is 1
          return error 'Value mismatch:', value
        f.get 'a', (err, value) ->
          if err
            return error err
          unless value is true
            return error err
          next()

  'del INI': (next) ->
    f.del 'x', 'y', (err) ->
      if err
        console.log 'EE', err
        return error err
      f.get 'x', 'y', (err, value) ->
        if value? or not err
          return error 'property still exists'
        next()


# run async tests
mkdirp 'tmp', {mode: '0777'}, (err) ->
  if err
    return error err

  next_async = ->
    for name, test of async_tests
      delete async_tests[name]
      if test
        console.log 'Running async test:', name
        test next_async
      return
  next_async()
