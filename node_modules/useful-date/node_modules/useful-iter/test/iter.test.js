suite( 'muigui/useful-iter', function() {
	test( '<static> iter', function( done ) {
		var undef;
		expect( iter( [] ) ).to.be.true;
		expect( iter( {} ) ).to.be.true;
		expect( iter( Object.create( null ) ) ).to.be.true;
		expect( iter( '' ) ).to.be.true;
		expect( iter( new Date() ) ).to.be.true;
		expect( iter( /.*/ ) ).to.be.true;
		expect( iter( undef ) ).to.be.false;
		expect( iter( null ) ).to.be.false;
		expect( iter( 3 ) ).to.be.false;

		done();
	} );

	test( '<static> iter.aggregate', function( done ) {
		expect( iter.aggregate( { one : 1, two : 2, three : 3 }, [], function( accumulator, value, key ) {
			accumulator.push( key );

			return accumulator;
		} ) ).to.deep.equal( ['one', 'two', 'three'] );

		expect( iter.aggregate( { one : 1, two : 2, three : 3 }, 1, function( accumulator, value, key ) {
			return accumulator += value;
		} ) ).to.equal( 7 );

		expect( iter.aggregate( iter.range( 0, 10 ), 0, function( accumulator, value, index ) {
			return accumulator += ( value * index );
		} ) ).to.equal( 385 );

		done();
    } );

	test( '<static> iter.equal:Array', function( done ) {
		expect( iter.equal( Object.keys( { one : 1, two : 2, three : 3 } ), Object.keys( { one : 1, two : 2, three : 3 } ) ) ).to.be.true;
		expect( iter.equal( [1, 2, 3], [1, 2, 3] ) ).to.be.true;
		expect( iter.equal( [1, 2, 3, [4, 5, 6, [7, 8, 9, [10]]]], [1, 2, 3, [4, 5, 6, [7, 8, 9, [10]]]] ) ).to.be.true;
		expect( iter.equal( [1, 2, 3, [4, 5, 6, [7, 8, 9, [10]]]], [1, 2, 3, [4, 5, 6, [7, 8, 9, [11]]]] ) ).to.be.false;
		expect( iter.equal( [1, 2, 3, [4, 5, 6, [7, 8, 9, [10]]]], [1, 2, 3, [4, 5, 6, [7, 8, 9]]] ) ).to.be.false;
		expect( iter.equal( [1, 2, 3, [4, 5, 6, [7, 8, 9, [10]]]], [1, 2, 3, [4, 5, [7, 9, [10]]]] ) ).to.be.false;

		done();
	} );

	test( '<static> iter.equal:Object', function( done ) {
		expect( iter.equal( { one : 1, two : 2, three : 3 }, { one : 1, two : 2, three : 3 } ) ).to.be.true;
		expect( iter.equal( new Date( 2012, 0, 1 ), new Date( 2012, 0, 1 ) ) ).to.be.true;
		expect( iter.equal( { one : 1, two : 2, three : 3, four : 4 }, { one : 1, two : 2, three : 3 } ) ).to.be.false;
		expect( iter.equal( { one : 1, two : 2, three : 3 }, { one : 1, two : 2, three : 3, four : 4 } ) ).to.be.false;
		expect( iter.equal( { one : 1, two : 2, three : 3, four : 4 }, { one : 1, two : 2, three : 3 } ) ).to.be.false;
		expect( iter.equal( { one : 1, two : 2, three : 3 }, { one : 1, two : 2, three : 3, four : 4 } ) ).to.be.false;

		done();
	} );

	test( '<static> iter.invoke', function( done ) {
		expect( iter.invoke( iter.range( 1, 5 ), 'toFixed', 2 ) ).to.deep.equal( ['1.00', '2.00', '3.00', '4.00', '5.00'] );
		expect( iter.invoke( iter.range( 1, 7 ), 'toString', 2 ) ).to.deep.equal( ['1', '10', '11', '100', '101', '110', '111'] );

		done();
	} );

	test( '<static> iter.len', function( done ) {
		expect( iter.len( { foo : 'bar' } ) ).to.equal( 1 );
		expect( iter.len( ['foo', 'bar'] ) ).to.equal( 2 );

		done();
	} );

	test( '<static> iter.pluck', function( done ) {
		var data = [{ data : { value : 'foo' } }, { data : { value : 'bar' } }, {}, { value : 'blim' }, { data : { value : 'blam' } }];
		expect( iter.pluck( data, 'data.value' ) ).to.deep.equal( ["foo", "bar", undefined, undefined, "blam"] );

		expect( iter.pluck( data, 'data.value', true ) ).to.deep.equal( ["foo", "bar", "blam"] );

		expect( iter.pluck( [
			{ 'one' : 1, 'two' : 2, 'three' : 3 },
			{ 'one' : 1, 'two' : 2, 'three' : 3 },
			{ 'one' : 1, 'two' : 2, 'three' : 3 }
		], 'two' ) ).to.deep.equal( [2, 2, 2] );

		expect( iter.pluck( [
			{ 'one' : 1,         'two' : 2, 'three' : 3 },
			{ 'one' : undefined, 'two' : 2, 'three' : 3 },
			{ 'one' : 1,         'two' : 2, 'three' : 3 },
			{ 'one' : null,      'two' : 2, 'three' : 3 },
			{ 'one' : 1,         'two' : 2, 'three' : 3 }
		], 'one', true ) ).to.deep.equal( [1, 1, 1] );

		expect( iter.pluck( iter.pluck( iter.range( 1, 10 ).map( function( o, i ) {
			return { src : { val : i } };
		} ), 'src' ), 'val' ) ).to.deep.equal( iter.range( 0, 9 ) );

		expect( iter.pluck( iter.pluck( iter.pluck( iter.range( 1, 10 ).map( function( o, i ) {
			return { src : { val : { id : i % 2 ? i : null } } };
		} ), 'src' ), 'val' ), 'id', true ) ).to.deep.equal( [1, 3, 5, 7, 9] );

		expect( iter.pluck( iter.range( 1, 10 ).map( function( o, i ) {
			return { src : { val : i } };
		} ), 'src.val' ) ).to.deep.equal( iter.range( 0, 9 ) );

		expect( iter.pluck( iter.range( 1, 10 ).map( function( o, i ) {
			return { src : { val : { id : i % 2 ? i : null } } };
		} ), 'src.val.id', true ) ).to.deep.equal( [1, 3, 5, 7, 9] );

		done();
	} );

	test( '<static> iter.range:Number', function( done ) {
		var returned = iter.range( 1, 10 );

		expect( returned ).to.deep.equal( [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] );
		expect( returned ).to.be.an( 'array' );

		done();
	} );

	test( '<static> iter.range:String', function( done ) {
		var returned = iter.range( 'a', 'z' );

		expect( returned ).to.be.an( 'array' );
		expect( returned.join( ' ' ) ).to.deep.equal( 'a b c d e f g h i j k l m n o p q r s t u v w x y z' );

		expect( iter.range( 'A', 'z' ).join( ' ' ) ).to.deep.equal( 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z [ \\ ] ^ _ ` a b c d e f g h i j k l m n o p q r s t u v w x y z' );
		expect( iter.range( 'α', 'ω' ).join( ' ' ) ).to.deep.equal( 'α β γ δ ε ζ η θ ι κ λ μ ν ξ ο π ρ ς σ τ υ φ χ ψ ω' );

		done();
	} );

	test( '<static> iter.remove:Array', function( done ) {
		expect( iter.remove( iter.range( 'a', 'k' ), 'b', 'd', 'f', 'h', 'j' ) ).to.deep.equal( ['a', 'c', 'e', 'g', 'i', 'k'] );
		expect( iter.remove( iter.remove( iter.range( 'l', 'z' ), ['l', 'n', 'p', 'r', 't', 'v', 'x', 'z'] ) ) ).to.deep.equal( ['m', 'o', 'q', 's', 'u', 'w', 'y'] );

		done();
	} );

	test( '<static> iter.remove:Object', function( done ) {
		var expected = { one : 1, three : 3, five : 5 };

		expect( iter.remove( { one : 1, two : 2, three : 3, four : 4, five : 5 }, 'two', 'four' ) ).to.deep.equal( expected );
		expect( iter.remove( { one : 1, two : 2, three : 3, four : 4, five : 5 }, ['two', 'four'] ) ).to.deep.equal( expected );

		done();
	} );
} );
