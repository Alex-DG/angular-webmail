# useful-value

  useful work around for existential getting/setting values in nested Objects

## Installation

  Install with [component(1)](http://component.io):

    $ component install muigui/useful-value

  Install with npm:

    $ npm install useful-value

## API

### value( item:Object, path:String ):Mixed
Returns the property value at the specified path in an Object.

#### Example:

```javascript

	var value = require( 'useful-value' );

    var data = { one : { two : { three : true, four : [1, 2, 3, 4] } } };

    value( data, 'one' );            // returns => { two : { three : true, four : [1, 2, 3, 4] } }

    value( data, 'one.two' );        // returns => { three : true, four : [1, 2, 3, 4] }

    value( data, 'one.two.three' );  // returns => { three : true }

    value( data, 'one.two.four' );   // returns => [1, 2, 3, 4]

    value( data, 'one.two.four.2' ); // returns => 3

```

### value.assign( item:Object, path:String, value:Mixed ):Mixed
Assign a `value` to an `item` using the given `path`.

Returns the passed `value`.

#### Example:

```javascript

	var value = require( 'useful-value' );

    var data = {};

    value.assign( data, 'one', {} );                   // data == { one : {} }

    value( data, 'one.two', {} );                // data == { one : { two : {} } }

    value( data, 'one.two.three', true );        // data == { one : { two : { three : true } } }

    value( data, 'one.two.four', [1, 2, 3, 4] ); // data == { one : { two : { three : true, four : [1, 2, 3, 4] } } }

```

### value.bless( namespace:String[, context:Object] ):Object
Creates an Object representation of the passed `namespace` String and returns it.

If a `context` Object is given, the Object tree created will be added to the `context` Object, otherwise it will be added to the global namespace.

**NOTE:** If any existing Objects with the same name already exist, they will **NOT** be replaced and any child Objects will be appended to them.

#### Example:

```javascript

	var value = require( 'useful-value' );

// value.ENV == 'browser'
    value.bless( 'foo.bar' );       // creates => global.foo.bar

// you can now do:
    foo.bar.Something = function() {};

    value.bless( 'foo.bar', value );   // creates => value.foo.bar

    var bar = value.bless( 'foo.bar' );

    bar === foo.bar              // returns => true

```

**IMPORTANT:** When using `value.bless` within a commonjs module: if you want your namespace Object to be assigned to the correct `module.exports`, then you should always pass the `module` — not `module.exports` — instance as the context (`ctx`) of your namespace.

#### Example:

```javascript

	var value = require( 'useful-value' );

// value.ENV == 'commonjs'

// inside my_commonjs_module.js
    value.bless( 'foo.bar', module );            // creates => module.exports.foo.bar

// you can now do:
    module.exports.foo.bar.Something = function() {};

// if you want to include "exports" in your namespace, you can do so by placing a carat (^) at the start of the String
    value.bless( 'exports.foo.bar', module ); // creates => module.exports.foo.bar

// otherwise, you will end up creating an extra exports Object, e.g:
    value.bless( 'exports.foo.bar', module ); // creates => module.exports.exports.foo.bar

// alternatively, you can also do:
    value.bless( 'foo.bar', module.exports ); // creates => module.exports.foo.bar

```

### value.coerce( item:Mixed ):Mixed
Attempts to coerce primitive values "trapped" in Strings, into their real types.

#### Example:

```javascript

	var value = require( 'useful-value' );

    value.coerce( 'false' );       // returns false

    value.coerce( 'null' );        // returns null

    value.coerce( 'true' );        // returns true

    value.coerce( 'undefined' );   // returns undefined

    value.coerce( 'NaN' );         // returns NaN

    value.coerce( '0001' );        // returns 1

    value.coerce( '0012' );        // returns 12

    value.coerce( '0123' );        // returns 123

    value.coerce( '123.4' );       // returns 123.4

    value.coerce( '123.45' );      // returns 123.45

    value.coerce( '123.456' );     // returns 123.456

    value.coerce( '123.456.789' ); // returns "123.456.789"

```

### value.empty( value:Mixed ):Boolean
Returns `true` if the passed `value` does not exist (see `exist` below), is an empty Array, Object, String or any other enumerable type.

#### Example:

```javascript

	var value = require( 'useful-value' );

    value.empty( undefined );    // returns => true

    value.empty( null );         // returns => true

    value.empty( '' );           // returns => true

    value.empty( [] );           // returns => true

    value.empty( {} );           // returns => true

    value.empty( ' ' );          // returns => false

    value.empty( [1] );          // returns => false

    value.empty( { 0 : null } ); // returns => false

```

### value.exists( value:Mixed ):Boolean
Returns `false` if the passed `value` is `undefined` , `NaN` or `null`, returns `true` otherwise.

#### Example:

```javascript

	var value = require( 'useful-value' );

    value.exists( undefined ); // returns => false

    value.exists( NaN );       // returns => false

    value.exists( null );      // returns => false

    value.exists( 0 );         // returns => true

    value.exists( false );     // returns => true

    value.exists( {} );        // returns => true

```

## License

(The MIT License)

Copyright (c) 2011 christos "constantology" constandinou http://muigui.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

![Analytics](https://ga-beacon.appspot.com/UA-15072756-2/muigui/useful-value/readme)
