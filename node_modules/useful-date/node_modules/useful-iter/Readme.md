
# useful-iter

  useful functions for working with Arrays and Objects

## Installation

  Install with [component(1)](http://component.io):

    $ component install muigui/useful-iter

  Install with npm:

    $ npm install useful-iter

## API

### iter( item:Mixed ):Boolean
Returns `true` if the passed item can be iterated over.

### iter.aggregate( item:Mixed, accumulator:Mixed, iterator:Function[, context:Object] ):Mixed
Works similar to [Array.prototype.reduce](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce).

Unlike `reduce`, you can also supply an optional `context` Object to `aggregate`.

`aggregate` will work on any iterable Object, so Array, Arguments, Function, HTMLCollection, NodeList, Object, etc.

If no `context` Object is supplied, the `item` being iterated over will be used as the `context` Object.

The `iterator` Function will receive 5 arguments:

<table border="0" cellpadding="0" cellspacing="0" width="100%"><thead>
	<tr><th>argument</th><th>type</th><th>description</th></tr>
</thead><tbody>
	<tr><td>accumulator</td><td>When the <code>iterator</code> Function is first called, this will be the initially supplied <code>accumulator</code>, after which it will be previous value returned by the <code>iterator</code> Function.</td></tr>
	<tr><td>value</td><td>The current item in the iteration.</td></tr>
	<tr><td>index_or_key</td><td>The current <code>index:Number</code> or <code>key:String</code> corresponding to the current <code>value</code> in the iteration.</td></tr>
	<tr><td>item</td><td>The <code>item</code> being iterated over.</td></tr>
</tbody></table>

#### Example:

```javascript

	var iter = require( 'useful-iter' );

    iter.aggregate( { one : 1, two : 2, three : 3 }, [], function( accumulator, value, key ) {
    	accumulator.push( key );
    	return accumulator;
    } ); // returns => ['one', 'two', 'three'];

    iter.aggregate( { one : 1, two : 2, three : 3 }, 1, function( accumulator, value, key ) {
    	return accumulator += value;
    } ); // returns => 7;

    iter.aggregate( iter.range( 0, 10 ), 0, function( accumulator, value, index ) {
    	return accumulator += ( value * index );
    } ); // returns => 385;

```

### iter.equal( a:Array|Object, b:Array|Object ):Boolean
Returns `true` if both `a` and `b` deeply equal each other, `false` otherwise.

#### Example:

```javascript

	var copy = require( 'useful-copy' ),
		iter = require( 'useful-iter' );

    var foo = { one : 1, two : 2, three : 3 },
        bar = copy( {}, foo );

    iter.equal( foo, bar ); // returns => true

    bar.four = 4;

    iter.equal( foo, bar ); // returns => false

```

### iter.invoke( items:Array, method:String[, arg1:Mixed, arg2:Mixed, ..., argN:Mixed] ):Array
Executes the passed `method` — **NOTE:** `method` is a String, and should be the name of `method` that exists on each item in the Array — passing any extra arguments to each method call.

#### Example:

```javascript

    iter.invoke( ['lorem', 'ipsum', 'dolor', 'sit', 'amet'], 'toUpperCase' ); // returns => ["LOREM", "IPSUM", "DOLOR", "SIT", "AMET"]

    iter.invoke( [1, 2, 3, 4, 5, 6, 7, 8] 'toString', 2 );                    // returns => ['1', '10', '11', '100', '101', '110', '111', '1000']

```

### iter.len( item:Mixed ):Number
Tries the returns the `length` property of the passed `item`.

#### Example:

```javascript

	var iter = require( 'useful-iter' );

    iter.len( { one : 1, two : 2, three : 3 } ); // returns => 3

    iter.len( [1, 2, 3] );                       // returns => 3

    iter.len( 'foobar' );                        // returns => 6

    iter.len( { one : 1, two : 2, three : 3 } ) === Object.keys( { one : 1, two : 2, three : 3 } ).length
    // returns => true

```

### iter.pluck( items:Array, key:String[, only_existing:Boolean] ):Array
Returns a new Array where all the items are the values of the passed property `key`.

If `only_existing` is set to `true` then all `null` and `undefined` values will be omitted from the returned Array.

**NOTEL** if you want to get at properties deeper than one level down, you can simply supply `the.correct.path`.

#### Example:

```javascript

    var data = [{ data : { value : 'foo' } }, { data : { value : 'bar' } }, {}, { value : 'blim' }, { data : { value : 'blam' } }];

    // harder to read
    iter.pluck( iter.pluck( data, 'data' ), 'value' ); // returns => ["foo", "bar", undefined, undefined, "blam"]

    // easier on the eye
    iter.pluck( data, 'data.value' );                  // returns => ["foo", "bar", undefined, undefined, "blam"]

    // return only existing values
    iter.pluck( data, 'data.value', true );            // returns => ["foo", "bar", "blam"]

```

### iter.range( begin:Number|String, end:Number|String ):Array
Returns an Array starting at `begin` where each value is incremented by `1` until `end` is reached.

#### Example:

```javascript

	var iter = require( 'useful-iter' );

    iter.range(  1,   10 );  // returns => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    iter.range( 20, 1000 );  // returns => [20, 21, 22, ..., 1000]

    iter.range( 'A', 'z' );  // returns => ['A', 'B', 'C', ..., 'x', 'y', 'z']
    iter.range( 'α', 'ω' ); // returns => ['α', 'β', 'γ', ..., 'χ', 'ψ', 'ω']

```

**NOTE:** Only the first character will be incremented in a `String` range.

### iter.remove( item:Array, value_or_index1:Number|Mixed|Number[]|Mixed[][, value_or_index2:Number|Mixed, ..., value_or_indexN:Number|Mixed] ):item
### iter.remove( item:Object, property1:String|String[][, property2:String, ..., propertyN:String] ):item
Removes items from the passed Array or Object and returns the passed Array or Object.

If removing items from an Array, you can either pass the index of the item you want to remove or the item itself.
If removing items from an Object, you simply pass the key of the item you want to remove.

#### Example:

```javascript

	var iter = require( 'useful-iter' );

    var foo_arr = ['one', 'two', 'three'],
       foo_obj = { one : 1, two : 2, three : 3 };

    iter.remove( foo_arr, 'one', 'three' );   // returns => ['two']

    iter.remove( foo_arr, ['one', 'three'] ); // same as above

    iter.remove( foo_arr, 0, 2 );             // same as above

    iter.remove( foo_arr, [0, 2] );           // same as above

    iter.remove( foo_obj, 'one', 'three' );   // returns => { two : 2 }

    iter.remove( foo_obj, ['one', 'three'] ); // same as above

```

## License

(The MIT License)

Copyright (c) 2011 christos "constantology" constandinou http://muigui.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

