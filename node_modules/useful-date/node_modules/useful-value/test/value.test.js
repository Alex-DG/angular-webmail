suite( 'muigui/useful-value', function() {
	test( '<static> value', function( done ) {
		var d = { one : { two : { three : true, four : [1, 2, 3, 4] } } };

		expect( value( d, 'one' ) ).to.deep.equal( d.one );
		expect( value( d, 'one.two' ) ).to.deep.equal( d.one.two );
		expect( value( d, 'one.two.three' ) ).to.deep.equal( d.one.two.three );
		expect( value( d, 'one.two.four' ) ).to.deep.equal( d.one.two.four );
		expect( value( d, 'one.two.four.2' ) ).to.deep.equal( d.one.two.four[2] );
		expect( value( d, 'one.three.four.2' ) ).to.be.undefined;
		expect( value( d, 'one.two.beep.7' ) ).to.be.undefined;
		expect( value( d, 'one.two.four.7' ) ).to.be.undefined;
		expect( value( 'foo', 'one.two.four.7' ) ).to.be.undefined;
		expect( value( 9, 'one.two.four.7' ) ).to.be.undefined;
		expect( value( undefined, 'one.two.four.7' ) ).to.be.undefined;
		expect( value( null, 'one.two.four.7' ) ).to.be.undefined;

		done();
	} );

	test( '<static> value.assign:Object', function( done ) {
		var expected = { one : { two : { three : true, four : [1, 2, 3, 4] } } },
			returned = {};

		value.assign( returned, 'one', {} );
		value.assign( returned, 'one.two', {} );
		value.assign( returned, 'one.two.three', true );
		value.assign( returned, 'one.two.four', [1, 2, 3, 4] );

		expect( returned ).to.deep.equal( expected );

		done();
	} );

	test( '<static> value.assign:Array', function( done ) {
		var expected = [1, 2, [3, 4, [5, 6]]],
			returned = [];

		value.assign( returned, 0, 1 );
		value.assign( returned, 1, 2 );
		value.assign( returned, 2, [3, 4] );
		value.assign( returned, '2.2', [5,6] );

		expect( returned ).to.deep.equal( expected );

		done();
	} );

	test( '<static> value.bless', function( done ) {
		var expected = { foo : { bar : 'hello' } };

		expect( value.bless( 'foo.bar' ) ).to.be.an( 'object' );

		expect( value.bless( 'foo.bar', expected ) ).to.equal( 'hello' );

		done();
	} );

	test( '<static> value.coerce', function( done ) {
		expect( value.coerce( 'false' ) ).to.be.false;
		expect( value.coerce( 'null' ) ).to.be.null;
		expect( value.coerce( 'true' ) ).to.be.true;
		expect( value.coerce( 'undefined' ) ).to.be.undefined;
		expect( isNaN( value.coerce( 'NaN' ) ) ).to.be.true;
		expect( value.coerce( '1' ) ).to.equal( 1 );
		expect( value.coerce( '12' ) ).to.equal( 12 );
		expect( value.coerce( '123' ) ).to.equal( 123 );
		expect( value.coerce( '123.4' ) ).to.equal( 123.4 );
		expect( value.coerce( '123.45' ) ).to.equal( 123.45 );
		expect( value.coerce( '123.456' ) ).to.equal( 123.456 );
		expect( value.coerce( '1e10' ) ).to.equal( 10000000000 );
		expect( value.coerce( '.0000000001e10' ) ).to.equal( 1 );

		done();
	} );


	test( '<static> value.empty', function( done ) {
		expect( value.empty( '' ) ).to.be.true;
		expect( value.empty( [] ) ).to.be.true;
		expect( value.empty( NaN ) ).to.be.true;
		expect( value.empty( {} ) ).to.be.true;
		expect( value.empty( null ) ).to.be.true;
		expect( value.empty( undefined ) ).to.be.true;
		expect( value.empty() ).to.be.true;
		expect( value.empty( 0 ) ).to.be.false;
		expect( value.empty( ' ' ) ).to.be.false;
		expect( value.empty( [''] ) ).to.be.false;
		expect( value.empty( { foo : '' } ) ).to.be.false;

		done();
	} );

	test( '<static> value.exists', function( done ) {
		expect( value.exists( 0 ) ).to.be.true;
		expect( value.exists( false ) ).to.be.true;
		expect( value.exists( '' ) ).to.be.true;
		expect( value.exists( NaN ) ).to.be.false;
		expect( value.exists( null ) ).to.be.false;
		expect( value.exists( undefined ) ).to.be.false;

		done();
	} );
} );
