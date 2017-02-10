suite( 'muigui/useful-type', function() {
	function Foo() {}
	Foo.prototype         = { constructor : Foo };

	function Bar() {}
	Bar.prototype         = { constructor : Bar };

	Foo.Bar               = function() {};
	Foo.Bar.prototype     = { constructor : Foo.Bar };

	Bar.Foo               = function() {};
	Bar.Foo.__classname__ = 'Bar.Foo';
	Bar.Foo.prototype     = { constructor : Bar.Foo };

	test( '<static> type.native', function( done ) {

		expect( type.native( null ) ).to.equal( 'null' );
		expect( type.native( undefined ) ).to.equal( 'undefined' );
		expect( type.native( [] ) ).to.equal( 'array' );
		expect( type.native( true ) ).to.equal( 'boolean' );
		expect( type.native( new Date() ) ).to.equal( 'date' );
		expect( type.native( function() {} ) ).to.equal( 'function' );
		expect( type.native( 0 ) ).to.equal( 'number' );
		expect( type.native( NaN ) ).to.equal( 'number' );
		expect( type.native( { get : function() {} } ) ).to.equal( 'object' );
		expect( type.native( { set : function() {} } ) ).to.equal( 'object' );
		expect( type.native( {} ) ).to.equal( 'object' );
		expect( type.native( Object.create( null ) ) ).to.equal( 'object' );
		expect( type.native( /.*/ ) ).to.equal( 'regexp' );
		expect( type.native( '' ) ).to.equal( 'string' );

		expect( type.native( new Foo ) ).to.equal( 'object' );
		expect( type.native( new Bar ) ).to.equal( 'object' );
		expect( type.native( new Foo.Bar ) ).to.equal( 'object' );
		expect( type.native( new Bar.Foo ) ).to.equal( 'object' );

		if ( typeof document != 'undefined' ) {
			expect( type.native( document.createElement( 'div' ) ) ).to.equal( 'htmldivelement' );

			expect( type.native( document.querySelectorAll( 'div' ) ) ).to.match( /htmlcollection|nodelist/ );
			expect( type.native( document.getElementsByTagName( 'div' ) ) ).to.match( /htmlcollection|nodelist/ );
		}

		expect( type.native( typeof global == 'undefined' ? window : global ) ).to.match( /global|window/ );

		done();
	} );

	test( '<static> type', function( done ) {
		expect( type( null ) ).to.equal( 'null' );
		expect( type( undefined ) ).to.equal( 'undefined' );
		expect( type( [] ) ).to.equal( 'array' );
		expect( type( true ) ).to.equal( 'boolean' );
		expect( type( new Date() ) ).to.equal( 'date' );
		expect( type( function() {} ) ).to.equal( 'function' );
		expect( type( 0 ) ).to.equal( 'number' );
		expect( type( NaN ) ).to.equal( 'number' );
		expect( type( {} ) ).to.equal( 'object' );
		expect( type( Object.create( null ) ) ).to.equal( 'object' );
		expect( type( /.*/ ) ).to.equal( 'regexp' );
		expect( type( '' ) ).to.equal( 'string' );

		expect( type( new Foo ) ).to.equal( 'foo' );
		expect( type( new Bar ) ).to.equal( 'bar' );
		expect( type( new Foo.Bar ) ).to.equal( 'object' );
		expect( type( new Bar.Foo ) ).to.equal( 'Bar.Foo' );

		if ( typeof document != 'undefined' ) {
			expect( type( document.createElement( 'div' ) ) ).to.equal( 'htmlelement' );

			expect( type( document.querySelectorAll( 'div' ) ) ).to.equal( 'htmlcollection' );
			expect( type( document.getElementsByTagName( 'div' ) ) ).to.equal( 'htmlcollection' );
		}

		expect( type( typeof global == 'undefined' ? window : global ) ).to.equal( 'global' );

		done();
	} );

} );
