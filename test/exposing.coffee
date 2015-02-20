
mkdirp  = require 'mkdirp'
objfile = require '../js/objfile'

error = (msg...) ->
  console.error '[FAIL]', msg...
  process.exit 1


# sync tests

# DESC

f = null

async_tests =
  'exposing all methods': (next) ->
    target = {}
    objfile 'tmp/exposing-all.ini', {expose: target}, (err) ->
      if err
        return error err
      unless target.get and target.set and target.del
        return error 'Missing method(s) on target'
      target.set 'a', 'b', 1, (err) ->
        if err
          return error err
        target.get 'a', 'b', (err, value) ->
          if err
            return error err
          unless value is 1
            return error 'Value mismatch:', value
          target.del 'a', 'b', (err) ->
            if err
              return error err
            next()

  'exposing get method (w/ multiple targets)': (next) ->
    target = {}
    f = objfile 'tmp/exposing-get.ini', {exposeGet: [{}, target]}, (err) ->
      if err
        return error err
      unless target.get
        return error 'Missing .get() method on target'
      if target.set or target.del
        return error 'Leaked method(s) on target'
      f.set 'a', 'b', 1, (err) ->
        if err
          return error err
        target.get 'a', 'b', (err, value) ->
          if err
            return error err
          unless value is 1
            return error 'Value mismatch:', value
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
