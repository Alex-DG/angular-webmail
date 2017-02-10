	function type( item ) {
		if ( !item )
			return native_type( item );

		if ( item === root )
			return 'global'; // this fixes various issues with msie and android

		var ctor  = item.constructor, ctype,
			ntype = native_type( item ),
			dtype = dom_type( ntype );

		if ( dtype )
			return dtype;

		if ( ntype == 'object' ) {
			if ( ctor && ctor !== Object ) {
				ctype = object_type( ctor );

				return ctype;
			}
		}

		return ntype;
	}

	function dom_type( dtype ) {
		if ( !!~dtype.indexOf( 'document' ) )
			return 'htmldocument';

		if ( dtype == 'htmlcollection' || dtype == 'nodelist' )
			return 'htmlcollection';

		if ( !dtype.indexOf( 'htm' ) && ( dtype.lastIndexOf( 'element' ) + 7 === dtype.length ) )
			return 'htmlelement';
	}

	function function_name( fn ) {
		return fn.name || fn.displayName || ( String( fn ).match( re_name ) || ['', ''] )[1].trim();
	}

	function object_type( fn ) {
		var func = fn.valueOf(),
			type = fn.__classname__ || func.__classname__ || String( function_name( fn === func ? fn : func ) ).toLowerCase();

		return !type || type == 'anonymous' || type == 'function' ? 'object' : type;
	}

	function native_type( item ) {
		var native_type = Object.prototype.toString.call( item );

		return ntype_cache[native_type]
		  || ( ntype_cache[native_type] = native_type.replace( re_tostr, '$1' ).toLowerCase() );
	}

	var UNDEF,
		ntype_cache = [
		 'Array',  'Boolean', 'Date',   'Function',
		 'Number', 'Object',  'RegExp', 'String',
		 'Null',   'Undefined'].reduce( function( cache, type ) {
			cache['[object ' + type + ']'] = type.toLowerCase();

			return cache;
		}, Object.create( null ) ),
		re_name     = /[\s\(]*function([^\(]+).*/,
		re_tostr    = /^\[object (?:[Ww]eb[Kk]it|[Mm]oz|[Mm]s|[Kk]html){0,1}([^\]]+)\]$/,
		root        = typeof global == 'undefined' ? window : global;

	type.native     = native_type;
	module.exports  = type;
