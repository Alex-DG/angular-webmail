
# useful-type

  useful type checking

## Installation

  Install with [component(1)](http://component.io):

    $ component install muigui/useful-type

  Install with npm:

    $ npm install useful-type

## API

### type( item:Mixed ):String
Returns the normalised `type` of the passed item.

#### Example:

```javascript

	var type = require( 'useful-type' );

    type( null );                                       // returns => "null"

    type( undefined );                                  // returns => "undefined"

    type( [] );                                         // returns => "array"

    type( true );                                       // returns => "boolean"

    type( new Date() );                                 // returns => "date"

    type( function() {} );                              // returns => "function"

    type( 0 );                                          // returns => "number"

    type( NaN );                                        // returns => "number"

    type( Object.create( null ) );                      // returns => "object"

    type( {} );                                         // returns => "object"

    type( /.*/ );                                       // returns => "regexp"

    type( '' );                                         // returns => "string"

    type( document.createElement( 'div' ) );            // returns => "htmlelement"

    type( document.querySelectorAll( 'div' ) );         // returns => "htmlcollection"

    type( document.getElementsByTagName( 'div' ) );     // returns => "htmlcollection"

    type( global );                                     // returns => "global"

    type( window );                                     // returns => "global"

```

### type.native( item:Mixed ):String (alias: ntype)
Returns the native `type` of the passed item. For normalised types use `type`.

#### Example:

```javascript

	var type = require( 'useful-type' );

    type.native( null );                                   // returns => "null"

    type.native( undefined );                              // returns => "undefined"

    type.native( [] );                                     // returns => "array"

    type.native( true );                                   // returns => "boolean"

    type.native( new Date() );                             // returns => "date"

    type.native( function() {} );                          // returns => "function"

    type.native( 0 );                                      // returns => "number"

    type( { enumerable : true, get : function() {} } );    // returns => "object"

    type( description( window, 'document' ) );             // returns => "object"

    type.native( {} );                                     // returns => "object"

    type.native( Object.create( null ) );                  // returns => "object"

    type.native( /.*/ );                                   // returns => "regexp"

    type.native( '' );                                     // returns => "string"

    type.native( document.createElement( 'div' ) );        // returns => "htmldivelement"

    type.native( document.querySelectorAll( 'div' ) );     // returns => "htmlcollection" || "nodelist"

    type.native( document.getElementsByTagName( 'div' ) ); // returns => "htmlcollection" || "nodelist"

    type.native( global );                                 // returns => "global"

    type.native( window );                                 // returns => "global" || "window"

```


## License

(The MIT License)

Copyright (c) 2011 christos "constantology" constandinou http://muigui.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
