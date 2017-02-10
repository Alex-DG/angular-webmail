// private methods
	function _24hrTime( o, res ) {
		return ( o = Number( o ) ) < 12 && _lc( res.ampm ) == _lc( Date.locale.PM ) ? o += 12 : o;
	}
	function _adjust_toobj( a ) {
		return adjust_order.reduce( function( v, k, i ) {
			var delta = parseFloat( a[i] );

			if ( !isNaN( delta ) && delta !== 0 )
				v[k] = delta;

			return v;
		}, Object.create( null ) );
	}
	function _dayOffset( d ) {
		return Math.floor( ( d - d.getISOFirstMondayOfYear( d ) ) / MS_DAY );
	}
	function _hours( d ) {
		return d.getHours() + ( d.isDST() ? 1 : 0 );
	}
	function _timezoneOffset( o ) {
		if ( o == 'Z' ) {
			o = '0000';
		}
		var t = !!o.indexOf( '-' ),
			m = o.match( re_tz_off ),
			v = ( Number( m[1] ) + ( m[2] / 60 ) ) * 3600;
		return t ? v : -v;
	}
	function _weekOffset( d ) {
		return Math.floor( Math.abs( _dayOffset( d ) / 7 ) );
	}
	function _zeroIndexedInt( o, k ) {
		return !isNaN( k ) ? k == o ? 0 : Number( k ) : Number( o ) - 1;
	}

// public methods
	def( 'adjust', function adjust( o, v ) {
		var date = this, day, fn, i, l, key, keys, weekday; // noinspection FallthroughInSwitchStatementJS
		switch ( type.native( o ) ) {
			case 'number' : o = Array.prototype.slice.call( arguments ); // allow fall-through
			case 'array'  : o = _adjust_toobj( o );                      // allow fall-through
			case 'object' :
				keys = Object.keys( o );
				i    = -1;
				l    = keys.length;

				while ( ++i < l )
					if ( Object.prototype.hasOwnProperty.call( o, keys[i] ) )
						date.adjust( keys[i], o[keys[i]] );

				break;
			case 'string' :
				fn = adjust_by[o.toLowerCase()];

				if ( fn && v !== 0 ) {
					Date.locale.setLeapYear( date );

					if ( fn == adjust_by.month ) {
						day = date.getDate();

						day < 28 || date.setDate( Math.min( day, date.getFirstOfTheMonth().adjust( Date.MONTH, v ).getLastOfTheMonth().getDate() ) );
					}

					fn != adjust_by.week || ( weekday = date.getDay() );

					date[fn[1]]( date[fn[0]]() + v );

					!weekday || date.setDate( date.getDate() + weekday );
				}
		}

		return date;
	} );

	def( 'between', function between( lower, higher ) {
		return +this >= +lower && +this <= +higher;
	} );

	def( 'clearTime', function clearTime() {
		this.setHours( 0 );
		this.setMinutes( 0 );
		this.setSeconds( 0 );
		this.setMilliseconds( 0 );
		return this;
	} );

	def( 'clone', function clone() {
		return new Date( this.getTime() );
	} );

	def( 'getDayOfYear', function getDayOfYear() {
		var L = Date.locale;

		L.setLeapYear( this );

		return L.day_count.slice( 0, this.getMonth() ).reduce( sum, 0 ) + this.getDate() - 1;
	} );

	def( 'getFirstOfTheMonth', function getFirstOfTheMonth() {
		return new Date( this.getFullYear(), this.getMonth(), 1 );
	} );

	def( 'getGMTOffset', function getGMTOffset( colon ) {
		var tz = this.getTimezoneOffset();

		return [( tz > 0 ? '-' : '+' ), pad( Math.floor( Math.abs( tz ) / 60 ), 2 ), ( colon ? ':' : '' ), pad( Math.abs( tz % 60 ), 2 )].join( '' );
	} );

	def( 'getISODay', function getISODay() {
		return this.getDay() || 7;
	} );

	def( 'getISODaysInYear', function getISODaysInYear() {
		return Math.ceil( ( ( new Date( this.getFullYear() + 1, 0, 1 ) ).getISOFirstMondayOfYear() - this.getISOFirstMondayOfYear() ) / MS_DAY );
	} );

	def( 'getISOFirstMondayOfYear', function getISOFirstMondayOfYear() {
		var y = this.getFullYear();

		return new Date( y, 0, DAY_OFFSETS[new Date( y, 0, 1 ).getDay()] );
	} );

	def( 'getISOWeek', function getISOWeek() {
		var w, y = this.getFullYear();

		if ( this >=  ( new Date( y + 1, 0, 1 ) ).getISOFirstMondayOfYear() )
			return 1;

		w = Math.floor( ( this.getDayOfYear() - this.getISODay() + 10 ) / 7 );

		return w == 0 ? ( new Date( y - 1, 0, 1 ) ).getISOWeeksInYear() - _weekOffset( this ) : w;
	} );

	def( 'getISOWeeksInYear', function getISOWeeksInYear() {
		return Math.round( ( ( new Date( this.getFullYear() + 1, 0, 1 ) ).getISOFirstMondayOfYear() - this.getISOFirstMondayOfYear() ) / MS_WEEK );
	} );

	def( 'getLastOfTheMonth', function getLastOfTheMonth() {
		var L = Date.locale, m = this.getMonth();

		L.setLeapYear( this );

		return new Date( this.getFullYear(), m, L.day_count[m] );
	} );

	def( 'getWeek', function getWeek() {
		return Math.floor( this.getDayOfYear() / 7 );
	} );

	def( 'isDST', function isDST() {
		return new Date( this.getFullYear(), 0, 1 ).getTimezoneOffset() != this.getTimezoneOffset();
	} );

	def( 'isLeapYear', function isLeapYear() {
		return Date.locale.isLeapYear( this.getFullYear() );
	} );

	def( 'setWeek', function setWeek( v ) {
		this.setMonth( 0 );
		this.setDate( 1 );

		return ( this.adjust( Date.DAY, v * 7 ) ).getTime();
	} );

	def( 'timezone', function timezone() {
		var s = this.toString().split( ' ' );

		return s.splice( 4, s.length ).join( ' ' ).replace( re_tz, '$1' ).replace( re_tz_abbr, '' );
	} );

	def( 'valid', function valid( date ) {
		return type.native( date ) == 'date' && !isNaN( +date );
	}, true );

	def( 'valid', function() {
		return Date.valid( this );
	} );
