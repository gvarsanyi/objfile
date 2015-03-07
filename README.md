objfile
==========

Read from + write to + update INI and JSON files via a simple asynchronous API.

# Install for your app
    cd /path/to/your/app
    npm install objfile --save

# Usage

## Example
    var objfile = require('objfile');

    var my_file = objfile('/path/to/my/file.ini'); // auto-identified as INI file

    // read
    my_file.get('my', 'hierarchy', 'in', 'the', 'object', function (err, value) {
      if (err) {
        console.error(err);
      } else {
        console.log('Value:', value);
      }
    });

    // write
    my_file.set('some', 'other', 'path', 'new_value', function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log('Value set');
      }
    });

## API
    // factory: returns instantiated IniFile or JsonFile
    objfile(path[, options][, callback]);
    // INI file
    new objfile.IniFile(path[, options][, callback]);
    // JSON file
    new objfile.JsonFile(path[, options][, callback]);

__Argument: path__
- type: __string__
- value: _/path/to/data/file_
- __required__

__Argument: options__
- type: __object__
- possible keys/values:
  - type: 'ini' or 'json' forces a type, no path-parsing (factory only)
  - dataRoot: data hierarchy root for get/set/del methods (default: top-level)
- __optional__

__Argument: callback__
- type: __function__
- call: __function (err) { /* err has value if file is not readable */ }__
- __optional__

__Return value__: _IniFile_ instance or _JsonFile_ instance

### Read (get)
    my_file.get(key1[, key2, ...], callback);

__Argument: key (any number)__
- type: __string__ or __number__
- value: key on object
- __required__

__Argument: callback__
- type: __function__
- call: __function (err, value) { /* err if key-path does not exist */ }__
- __required__

__Return value__: _undefined_

### Write (set)
    my_file.get(key1[, key2, ...], value, callback);

__Argument: key (any number)__
- type: __string__ or __number__
- value: key on object
- __required__

__Argument: value (required, any type)__

__Argument: callback__
- type: __function__
- call: __function (err) { /* err if sync fails */ }__
- __optional__

__Return value__: _undefined_

### Delete
    my_file.del(key1[, key2, ...], callback);

__Argument: key (any number)__
- type: __string__ or __number__
- value: key on object
- __required__

__Argument: callback__
- type: __function__
- call: __function (err) { /* err if sync fails or key-path does not exist */ }__
- __optional__

__Return value__: _undefined_
