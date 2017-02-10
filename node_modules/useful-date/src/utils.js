// utility methods
	function _indexOf( o, k ) {
		var i = o.indexOf( k ); return i == -1 ? null : i;
	}

	function _lc( o ) {
		return o.toLocaleLowerCase();
	}

	function _uc( o ) {
		return o.toLocaleUpperCase();
	}

	function associate( o, k ) {
		return o.reduce( function( res, v, i ) {
			res[k[i]] = v;
			return res;
		}, {} );
	}

	function between_equalto( value, lower, higher ) {
		return lower <= value && value <= higher;
	}

	function def( name, value, is_static, force ) {
		var target = is_static === true ? Date : DATE_PROTO;

		if ( force !== true && name in target )
			return target[name];

		Object.defineProperty( target, name, {
			configurable : true, enumerable : false, value : value, writable : true
		} );

		return value;
	}

	function pad( o, len, radix ) {
		var i = -1, s = o.toString( radix || 10 );
		len -= s.length;
		while ( ++i < len ) s = '0' + s;
		return s;
	}

	function pluck( arr, key ) {
		return arr.reduce( function( res, val ) {
			res.push( value( val, key ) );

			return res;
		}, [] );
	}

	function sum( v, i ) {
		return v + i;
	}
