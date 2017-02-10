suite( 'muigui/useful-copy', function() {
	test( '<static> copy', function( done ) {
		var expected = { foo : { bar : 'hello' } };

		expect( copy( {}, expected ) ).to.eql( expected );
		expect( copy( expected, { foo : { bar : 'goodbye' } }, true ) ).to.eql( expected );
		expect( copy( { foo : { bar : 'goodbye' } }, expected ) ).to.eql( expected );

		done();
	} );

	test( '<static> copy.merge', function( done ) {
		var expected = { foo : 'bar', items : [ { value : 1 }, { items : [ { value : 1 }, { items : [ { value : 1 }, { value : 2 }, { value : 3 } ], value : 2 }, { value : 3 } ], value : 2 }, { value : 3 } ] },
			returned = copy.merge( Object.create( null ), expected ),
			overwritten = copy.merge( { items : [ { value : '1 2 3' }, { items : Array.apply( [], new Array( 100 ) ).map( function( o, i ) { return i + 1; } ) } ] }, expected );

		expect( returned ).to.not.equal( expected );
		expect( returned ).to.eql( expected );
		expect( returned.items ).to.not.equal( expected.items );
		expect( returned.items[1].items[1] ).to.not.equal( expected.items[1].items[1] );

		expect( overwritten.items[0].value ).to.equal( 1 );
		expect( overwritten.items[1].items.length ).to.equal( 3 );
		expect( overwritten.items[1].items ).to.not.equal( expected.items[1].items );
		expect( overwritten.items[2].value ).to.equal( 3 );

		done();
	} );

	test( '<static> copy.update', function( done ) {
		var expected = { foo : 'bar', items : [ { id : 1, value : 1 }, { items : [ { value : 1 }, { items : [ { value : 1 }, { value : 2 }, { value : 3 } ], value : 2 }, { value : 3 } ], value : 2 }, { value : 3 } ] },
			returned = copy.update( Object.create( null ), expected ),
			overwritten = copy.update( { foo : 'foo', items : [ { value : '1 2 3' }, { items : [ { id : 0 }, { items : [ { id : 2 } ] }].concat( [0, 1, 2, 3] ) } ] }, expected );

		expect( returned ).to.not.equal( expected );
		expect( returned ).to.eql( expected );
		expect( returned.items ).to.not.equal( expected.items );
		expect( returned.items[1].items[1] ).to.not.equal( expected.items[1].items[1] );

		expect( overwritten.foo ).to.equal( 'foo' );
		expect( overwritten.items[1].items.length ).to.equal( 6 );
		expect( overwritten.items[0].id ).to.equal( 1 );
		expect( overwritten.items[0].value ).to.equal( '1 2 3' );
		expect( overwritten.items[0] ).to.not.equal( expected.items[0] );
		expect( overwritten.items[1].items[0].id ).to.equal( 0 );
		expect( overwritten.items[1].items[0].value ).to.equal( 1 );
		expect( overwritten.items[1].items[1].items.length ).to.equal( 3 );
		expect( overwritten.items[1].items[1].items[0].id ).to.equal( 2 );
		expect( overwritten.items[1].items[1].items[0].value ).to.equal( 1 );
		expect( overwritten.items[1].items[1].items.length ).to.not.equal( expected.items[1].items[1].items );

		done();
	} );
} );
