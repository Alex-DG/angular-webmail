	var copy         = require( 'useful-copy' ),
		iter         = require( 'useful-iter' ),
		type         = require( 'useful-type' ),
		value        = require( 'useful-value' ),

		UNDEF,
		DATE_PROTO   = Date.prototype,

// DAY_OFFSETS is the amount of days from the current day to the Monday of the week it belongs to
		DAY_OFFSETS  = [9, 1, 0, -1, -2, 4, 3],
// constants defining milliseconds for different times
		MS_DAY       = def( 'MS_DAY',    864e5,   true ),
		MS_HOUR      = def( 'MS_HOUR',   3600000, true ),
		MS_MINUTE    = def( 'MS_MINUTE', 60000,   true ),
		MS_MONTH     = def( 'MS_MONTH',  2592e6,  true ),
		MS_SECOND    = def( 'MS_SECOND', 1000,    true ),
		MS_WEEK      = def( 'MS_WEEK',   6048e5,  true ),
		MS_YEAR      = def( 'MS_YEAR',   31536e6, true ),
// parser keys
		AMPM         = 'ampm',
		DAY          = def( 'DAY',         'day',   true ),
		DAYWEEK      = 'dayweek',
		DAYYEAR      = 'dayyear',
		HOUR         = 'hour',
		MILLISECOND  = def( 'MILLISECOND', 'ms',    true ),
		MINUTE       = 'minute',
		MONTH        = def( 'MONTH',       'month', true ),
		SECOND       = 'second',
		TIMEZONE     = 'timezone',
		UNIX         = 'unix',
		WEEK         = def( 'WEEK',        'week',  true ),
		YEAR         = def( 'YEAR',        'year',  true ),
// used by Date.prototype.format && Date.toDate to replace escaped chars
		NOREPLACE    = 'NOREPLACE', NOREPLACE_RB = '<' + NOREPLACE + '<', NOREPLACE_RE = '>END' + NOREPLACE + '>',
		adjust_by    = {
			day   : ['getDate',  'setDate'],  hr   : ['getHours',        'setHours'],        min : ['getMinutes', 'setMinutes'],
			month : ['getMonth', 'setMonth'], ms   : ['getMilliseconds', 'setMilliseconds'], sec : ['getSeconds', 'setSeconds'],
			week  : ['getWeek',  'setWeek'],  year : ['getFullYear',     'setFullYear']
		},
		adjust_order = [YEAR, MONTH, WEEK, DAY, 'hr', MINUTE.substring( 0, 3 ), SECOND.substring( 0, 3 ), MILLISECOND],
// cache objects
		cache_format = Object.create( null ), cache_parse = Object.create( null ), date_members = [DAY, DAYWEEK, DAYYEAR, MONTH, WEEK, YEAR],
		filter, filter_chars, formats,
		lexicon      = def( 'lexicon', Object.create( null ), true ),
		locales      = Object.create( null ),
		m, parser,
		re_ampm      = '(am|pm)',             re_add_enr  = />/g,                  re_add_nr    = /</g, re_compile,
		re_d1_2      = '([0-9]{1,2})',        re_d2       = '([0-9]{2})',          re_d4        = '([0-9]{4})',
		re_space     = /\s{2,}/g,             re_split    = /[<>]/,                re_tz        = /[^\(]*\(([^\)]+)\)/g,
		re_tz_abbr   = /[^A-Z]+/g,            re_tz_off   = /[\+-]?([0-9]{2}):?([0-9]{2})/,
		time_map     = def( 'time_map', [ // the order of this Array is important as it is the remainder of the larger
			[YEAR   + 's', MS_YEAR],      // time unit that gets passed to the following time unit — as such we want
			[MONTH  + 's', MS_MONTH],     // to keep the order in case we want to exclude time units from the diff
			[WEEK   + 's', MS_WEEK],
			[DAY    + 's', MS_DAY],
			[HOUR   + 's', MS_HOUR],
			[MINUTE + 's', MS_MINUTE],
			[SECOND + 's', MS_SECOND],
			[MILLISECOND,  1]
		], true ),
		time_props   = def( 'time_props', pluck( time_map, 0 ), true );
;
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
;
	def( 'coerce', function coerce( date_str, date_format ) {
		return buildParser( date_format )( date_str );
	}, true );

	function buildParser( date_format ) {
		var LID = Date.locale.id, i, keys, l, parsers, part, parts, re;

		if ( cache_parse[LID][date_format] ) return cache_parse[LID][date_format];

		parts = date_format.replace( re_add_nr, NOREPLACE_RB ).replace( re_add_enr, NOREPLACE_RE ).split( re_split );
		keys  = []; i = -1; l = parts.length; parsers = {}; re = [];

		while ( ++i < l ) {
			part = parts[i];
			if ( part == NOREPLACE ) {
				re.push( parts[++i] ); ++i;
				continue;
			}
			part.replace( re_compile, function( m, p1, p2, p3 ) {
				var _fn, _k, _p;
				if ( !( _p = parser[p2] ) ) return;
				if ( _p.k ) {
					keys.push( _p.k );
					if ( _p.fn ) parsers[_p.k] = _p.fn;
				}
				if ( _p.combo ) {
					_k  = pluck( _p.combo, 'k' );
					_fn = associate( pluck( _p.combo, 'fn' ), _k );
					keys.push.apply( keys, _k );
					copy( parsers, _fn, true );
				}
				if ( _p.re ) re.push( p1, _p.re, p3 );
			} );
		}
		return cache_parse[LID][date_format] = parse.bind( null, new RegExp( re.join( '' ) ), keys, parsers );
	}

	function parse( re, keys, fn, s ) {
		var date    = new Date( 0, 0, 1, 0, 0, 0, 0 ), i = -1, l = keys.length,
			parts   = s.match( re ),
			parsers = associate( parts.slice( 1 ), keys );

		while ( ++i < l )
			if ( typeof parsers[keys[i]] == 'string' && fn[keys[i]] )
				parsers[keys[i]] = fn[keys[i]]( parsers[keys[i]], parsers );

		if ( !isNaN( parsers[UNIX] ) )
			date.setTime( parsers[UNIX] );
		else {
			parse_setTime( date, parsers[HOUR], parsers[MINUTE], parsers[SECOND], parsers[MILLISECOND] );
			parse_setDate( date, parsers );
			parse_setTimezoneOffset( date, parsers[TIMEZONE] );
		}

		return date;
	}

	function parse_setDate( date, parsers ) {
		var L = Date.locale, dayweek, i = -1, l, leapyr, ordinal;

		if ( date_members.every( Object.prototype.hasOwnProperty.bind( parsers ) ) )
			return; //  only set the date if there's one to set (i.e. the format is not just for time)

		if ( isNaN( parsers[YEAR] ) )
			parsers[YEAR] = date.getFullYear();

		if ( isNaN( parsers[MONTH] ) ) {
			leapyr  = L.isLeapYear( parsers[YEAR] ) ? 1 : 0;
			ordinal = L.ordinal_day_count[leapyr];
			l       = ordinal.length;
			parsers[MONTH] = 0;

			if ( parsers[WEEK] && !parsers[DAYYEAR] ) { // give precedence to the day of the year
				dayweek = parsers[DAYWEEK];
				dayweek = isNaN( dayweek ) ? 0 : !dayweek ? 7 : dayweek;
				parsers[DAYYEAR] = ( parsers[WEEK] * 7 ) - ( 4 - dayweek );
			}

			if ( !isNaN( parsers[DAYYEAR] ) ) {
				if ( parsers[DAYYEAR] > ordinal[ordinal.length - 1] ) {
					parsers[DAYYEAR] -= ordinal[ordinal.length - 1];
					++parsers[YEAR];
				}
				while( ++i < l ) {
					if ( between_equalto( parsers[DAYYEAR], ordinal[i], ordinal[i+1] ) ) {
						parsers[MONTH] = i;
						parsers[DAY] = ordinal[i] == 0 ? parsers[DAYYEAR] : ( parsers[DAYYEAR] - ordinal[i] );
						break;
					}
				}
			}
		}

		if ( isNaN( parsers[DAY] ) )
			parsers[DAY] = 1;

		date.setYear( parsers[YEAR] );
		date.setMonth( parsers[MONTH] );
		date.setDate( parsers[DAY] );

	}
	function parse_setTime( date, hr, min, sec, ms ) {
		date.setHours( hr || 0 );
		date.setMinutes( min || 0 );
		date.setSeconds( sec || 0 );
		date.setMilliseconds( ms || 0 );
	}

	function parse_setTimezoneOffset( date, tzoffset ) {
		if ( between_equalto( tzoffset, -43200, 50400 ) )
			date.adjust( Date.SECOND, ( -date.getTimezoneOffset() * 60 ) - tzoffset );
	}
;
	def( 'diff', function diff( now, props ) { //noinspection FallthroughInSwitchStatementJS
		switch ( type.native( now ) ) {
			case 'number' : case 'string' :
				if ( Date.valid( new Date( now ) ) )
					now = new Date( now );
				else {
					if ( !props ) props = now;

					now = Date.now();

					break;
				}                                                  // allow [specific] fall-through
			case 'array'  : case 'object' :
				props   = now;
				now     = Date.now();
				break;
			case 'date'   : if ( Date.valid( new Date( +now ) ) ) break; // allow [conditional] fall-through if not a valid date
			default       : now = Date.now();

		}

		var diff,
			ms    = +now - +this,
			tense = ms < 0 ? 1 : ms > 0 ? -1 : 0;

		if ( !tense ) {
			diff       = Object.create( null );
			diff.value = 0;
		}
		else
			diff = diff_get( Math.abs( ms ), diff_get_exclusions( props ) );

		diff.tense = tense;

		return diff;
	} );

// this ensures a diff's keys are always in descending order of
// number of milliseconds per unit of time, i.e. year, ..., millisecond
	def( 'diffKeys', function diff_keys( diff ) {
		diff = copy( diff );

		iter.remove( diff, 'tense', 'value' );

// while this may seem like overkill, only having to run `indexOf` once for each sort item means that
// the overall performance is dramatically improved
		return pluck( Object.keys( diff ).map( function( k ) {
			return [time_props.indexOf( k ), k];
		} ).sort( function( a, b ) {
			a = a[0]; b = b[0];
			return a > b ? 1 : -1; // skipping `===` check as we know all indexes are unique
		} ), 1 );
	}, true );

	function diff_eval( diff, calc, i, calcs ) {
		var time;
		if ( diff.__ms__ ) {
			if ( !diff.excl[calc[0]] ) {
				if ( diff.__ms__ >= calc[1] ) {

					time = diff.__ms__ / calc[1];

					if ( !( calc[0] in diff.val ) ) {
						diff.__ms__       = ( time % 1 ) * calc[1];
						diff.val[calc[0]] = Math.floor( time );
					}
					else {
						time                 = Math.floor( time );
						diff.__ms__       -= time * calc[1];
						diff.val[calc[0]] += time;
					}

				}
				return diff;
			}
// round up or down depending on what's available
			if ( ( !calcs[i + 1] || diff.excl[calcs[i + 1][0]] ) && ( calc = calcs[i - 1] ) ) {
				time          = diff.__ms__ / calc[1];
				diff.__ms__ = ( Math.round( time ) * calc[1] ) + ( ( ( diff.__ms__ / calcs[i][1] ) % 1 ) * calcs[i][1] );
				return diff_eval( diff, calc, i - 1, [] );
			}
			return diff;
		}
		return diff;
	}

	function diff_get( ms, excl ) {
		var diff = time_map.reduce( diff_eval, {
				__ms__ : ms, excl : excl, val : Object.create( null )
			} ).val;

		diff.value = ms;

		return diff;
	}

	function diff_get_exclusions( props ) {
		var excl = Object.create( null ), incl_remaining = true;

		if ( props ) { //noinspection FallthroughInSwitchStatementJS
			switch ( type.native( props ) ) {
				case 'object' : incl_remaining = false; break;
				case 'string' : props          = props.split( ' ' ); // allow fall-through
				case 'array'  : props          = props.reduce( diff_excl, excl );
								incl_remaining = !!iter.len( excl );
			}
		}

		time_props.map( function( prop ) {
			if ( !( prop in this ) )
				this[prop] = !incl_remaining;
		}, excl );

		return excl;
	}

	function diff_excl( excl, val ) {
		var prop = ( val = String( val ).toLowerCase() ).substring( 1 );

		switch ( val.charAt( 0 ) ) {
			case '-' : excl[prop] = true;  break;
			case '+' : excl[prop] = false; break;
			case '>' :
				time_map.map( diff_excl_iter, { excl : excl, prop : prop, val : true } );
				break;
			case '<' :
				time_map.slice().reverse().map( diff_excl_iter, { excl : excl, prop : prop, val : false } );
				break;
			default  : excl[val]  = false;
		}

		return excl;
	}

	function diff_excl_iter( calc ) {
		if ( calc[0] === this.prop )
			this.SET_VALID = true;
		if ( this.SET_VALID )
			this.excl[calc[0]] = this.val;
	}
;
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
;

	def( 'format', function format( f ) {
		return buildTemplate( f )( filter, this );
	} );

	function buildTemplate( date_format ) {
		var LID = Date.locale.id, fn, i, l, part, parts, re_invalid;

		if ( cache_format[LID][date_format] ) return cache_format[LID][date_format];

		fn         = ['\tvar out=[];'];
		parts      = date_format.replace( re_add_nr, NOREPLACE_RB ).replace( re_add_enr, NOREPLACE_RE ).split( re_split ),
		re_invalid = /^[^A-Za-z]*$/g;
		i = -1;  l = parts.length;

		while( ++i < l ) {
			part = parts[i];
			part == NOREPLACE ? ( fn.push( tplOut( parts[++i] ) ), ++i )
						   :   re_invalid.test( part )
						   ?   fn.push( tplOut( part ) )
						   :   fn.push( compileTplStr( part ) );
		}

		fn.push( 'return out.join( "" );\n\t//@ sourceURL=Date/format/' + LID + '/' + date_format );

		return cache_format[LID][date_format] = new Function( 'filter', 'date', fn.join( '\n\n\t' ) );
	}

	function compileTplStr( o ) {
		return o.replace( re_compile, function( m, p0, p1, p2 ) {
			return tplOut( p0 + '\', filter.' + p1 + '( date ), \'' + p2 );
		} );
	}

	function tplOut( s ) {
		return 'out.push( \'' + s + '\' );';
	}
;
	def( 'lexicalize', function lexicalize( now, precision ) {
		if ( !Date.valid( now ) ) {
			if ( Date.valid( new Date( now ) ) )
				now       = new Date( now );
			else {
				precision = now;
				now       = Date.now();
			}
		}

		var LEX = Date.locale.lexicon;

		if ( typeof lexicon[precision = String( precision ).toLowerCase()] != 'function' )
			precision = LEX.DEFAULT;

		return !( +now - +this ) ? LEX.just_now : lexicon[precision].call( LEX, this, now ).replace( re_space, ' ' );
	} );

	function lexicalize_approx( parts, diff ) {
		return parts.join( ' ' );
	}

	function lexicalize_exact( parts, diff ) {
		var last = parts.pop();

		return ( parts.length ? parts.join( this.delim ) + ' ' + this.and + ' ' + last : last ) + ' ' + this[diff.tense < 1 ? 'ago' : 'from_now'];
	}

	lexicon.approx = function( date, now ) {
		var	adverb, bal, determiner = this.a,
			diff  = date.diff( now ),
			dkeys = Date.diffKeys( diff ), index, parts, tense,
			tm    = Date.time_map, tu = this.time_units, today, use_noun;

		if ( diff.value < Date.MS_MINUTE )
			return this.just_now;

		switch ( dkeys[0] ) {
			case 'years'   : index       = 0; break;
			case 'months'  : index       = 1; break;
			case 'weeks'   : index       = 2; break;
			case 'days'    : if ( diff.days < 2 ) {
								today    = date.format( 'l' ) === now.format( 'l' );
								use_noun = today || dkeys[1] != 'hours' || diff.hours < 25;
							 }
							 index       = 3; break;
			case 'hours'   : today       = date.format( 'l' ) === now.format( 'l' );
							 use_noun    = diff.hours / 24 >= .75;
							 determiner  = this.an;
							 index       = 4; break;
			case 'minutes' : index       = 5; break;
		}

		bal  = ( diff.value - tm[index][1] * diff[dkeys[0]] ) / tm[index][1];

		if ( use_noun )
			return today ? this.today : diff.tense > 0 ? this.tomorrow : this.yesterday;

		parts = [];
		tense = diff.tense > 0 ? this.from_now : this.ago;

		if ( bal < .1 ) { //noinspection FallthroughInSwitchStatementJS
			switch ( dkeys[0] ) {
				case 'years' : case 'months' : case 'weeks' :
					if ( diff[dkeys[0]] === 1 ) {
						parts.push( ( diff.tense < 1 ? this.last : this.next ), tu[index][0] );
						break;
					} // allow [conditional] fall-through
				default      :
					!bal || parts.push( this.about );
					parts.push( diff[dkeys[0]], tu[index][diff[dkeys[0]] > 1 ? 1 : 0], tense );
			}
		}
		else {
			if ( bal < .74 ) {
				if ( bal < .24 )
					adverb = this.just_over;
				else {
					adverb = ( bal > .24 && bal < .4 ) ? this.almost : this.about;
					parts.push( this.and, this.a, this.half );
				}
			}
			else
				parts.push( this.almost, ( diff[dkeys[0]] + 1 ), tu[index][1], tense );
		}

		if ( adverb ) {
			parts.push( tu[index][diff[dkeys[0]] > 1 || parts.length ? 1 : 0], tense );
			parts.unshift( adverb, diff[dkeys[0]] );
		}

		return typeof this.approx == 'function' ? this.approx.call( this, parts, diff ) : lexicalize_approx.call( this, parts, diff );
	};

	lexicon.exact  = function( date, now ) {
		var diff = date.diff( now ), parts, tu = this.time_units;

		parts = Date.time_map.reduce( function( val, unit, i ) {
			var v = diff[unit[0]];

			!v || !tu[i] || val.push( v + ' ' + tu[i][v > 1 ? 1 : 0] );

			return val;
		}, [] );

		if ( !parts.length )
			return this.just_now;

		return typeof this.exact == 'function' ? this.exact.call( this, parts, diff ) : lexicalize_exact.call( this, parts, diff );
	};
;
	def( 'localize', function localize( locale ) { //noinspection FallthroughInSwitchStatementJS
		switch ( type.native( locale ) ) {
			case 'object' :
				if ( locale.id ) {
					locales[locale.id] = locale;
					break;
				} // allow [conditional] fall-through
			case 'string' :
				if ( locale in locales ) {
					locale = locales[locale];
					break;
				} // allow [conditional] fall-through
			default       : locale = null;
		}

		if ( type.native( locale ) == 'object' ) {
			def( 'locale',      locale,             true, true );
			def( 'getOrdinal',  locale.getOrdinal,  true, true );
			def( 'isLeapYear',  locale.isLeapYear,  true, true );
			def( 'setLeapYear', locale.setLeapYear, true, true );

			if ( !( locale.id in cache_format ) )
				cache_format[locale.id] = Object.create( null );
			if ( !( locale.id in cache_parse ) )
				cache_parse[locale.id] = Object.create( null );

			filter  = localize_filters( locale );
			formats = localize_formats( locale );
			parser  = localize_parsers( locale );
		}

		return Date;
	}, true );

	module.exports = Date;
;
	function localize_filters( L ) {
		var F = {
// day
			d : function( d ) { return pad( d.getDate(), 2 ); },                        // Day of the month, 2 digits with leading zeros
			D : function( d ) { return L.days[d.getDay()].substring( 0, 3 ); },         // A textual representation of a day, three letters
			j : function( d ) { return d.getDate(); },                                  // Day of the month without leading zeros
			l : function( d ) { return L.days[d.getDay()]; },                           // A full textual representation of the day of the week
			N : function( d ) { return DATE_PROTO.getISODay.call( d ); },               // ISO-8601 numeric representation of the day of the week
			S : function( d ) { return L.getOrdinal( d.getDate() ); },                  // English ordinal suffix for the day of the month, 2 characters
			w : function( d ) { return d.getDay(); },                                   // Numeric representation of the day of the week
			z : function( d ) { return DATE_PROTO.getDayOfYear.call( d ); },            // The day of the year (starting from 0)
// week
			W : function( d ) { return d.getISOWeek(); },                               // ISO-8601 week number of year, weeks starting on Monday
// month
			F : function( d ) { return L.months[d.getMonth()]; },                       // A full textual representation of a month
			m : function( d ) { return pad( ( d.getMonth() + 1 ), 2 ); },               // Numeric representation of a month, with leading zeros
			M : function( d ) { return L.months[d.getMonth()].substring( 0, 3 ); },     // A short textual representation of a month, three letters
			n : function( d ) { return d.getMonth() + 1; },                             // Numeric representation of a month, without leading zeros
			t : function( d ) {                                                         // Number of days in the given month
				L.setLeapYear( d );
				return L.day_count[d.getMonth()];
			},
// year
			L : function( d ) { return DATE_PROTO.isLeapYear.call( d ) ? 1 : 0; },      // Whether it's a leap year
			o : function( d ) {                                                         // ISO-8601 year number. This has the same value as Y, except that if the ISO
				var m = d.getMonth(), w = DATE_PROTO.getISOWeek.call( d );              // week number (W) belongs to the previous or next year, that year is used instead.
				return ( d.getFullYear() + ( w == 1 && m > 0 ? 1 : ( w >= 52 && m < 11 ? -1 : 0 ) ) );
			},
			Y : function( d ) { return d.getFullYear(); },                               // A full numeric representation of a year, 4 digits
			y : function( d ) { return String( d.getFullYear() ).substring( 2, 4 ); },   // A two digit representation of a year
// time
			a : function( d ) { return _lc( d.getHours() < 12 ? L.AM : L.PM ); },        // Lowercase Ante meridiem and Post meridiem
			A : function( d ) { return _uc( d.getHours() < 12 ? L.AM : L.PM ); },        // Uppercase Ante meridiem and Post meridiem
			g : function( d ) { return d.getHours() % 12 || 12; },                       // 12-hour format of an hour without leading zeros
			G : function( d ) { return d.getHours(); },                                  // 24-hour format of an hour without leading zeros
			h : function( d ) { return pad( filter.g( d ), 2 ); },                       // 12-hour format of an hour with leading zeros
			H : function( d ) { return pad( filter.G( d ), 2 ); },                       // 24-hour format of an hour with leading zeros
			i : function( d ) { return pad( d.getMinutes(), 2 ); },                      // Minutes with leading zeros
			s : function( d ) { return pad( d.getSeconds(), 2 ); },                      // Seconds, with leading zeros
			u : function( d ) { return pad( d.getMilliseconds(), 3 ); },                 // Milliseconds
// timezone
			O : function( d ) { return DATE_PROTO.getGMTOffset.call( d ); },             // Difference to Greenwich time (GMT) in hours
			P : function( d ) { return DATE_PROTO.getGMTOffset.call( d, true ); },       // Difference to Greenwich time (GMT) with colon between hours and minutes
			T : function( d ) { return DATE_PROTO.timezone.call( d ); },                 // Timezone abbreviation
			Z : function( d ) { return DATE_PROTO.getTimezoneOffset.call( d ) * -60; },  // Timezone offset in seconds. The offset for timezones west of UTC
																					     // is always negative, and for those east of UTC is always positive.
// full date/time
			c : function( d ) { return DATE_PROTO.format.call( d, formats.ISO_8601 ); }, // ISO 8601 date
			r : function( d ) { return DATE_PROTO.format.call( d, formats.RFC_2822 ); }, // RFC 2822 formatted date
			U : function( d ) { return d.getTime(); },                                   // Seconds since the Unix Epoch January 1 1970 00:00:00 GMT

// custom
			e : function( d ) { return DATE_PROTO.lexicalize.call( d, 'exact' );  },
			x : function( d ) { return DATE_PROTO.lexicalize.call( d, 'approx' ); }
		};

		filter_chars  = Object.keys( F ).sort().join( '' );

		re_compile    = new RegExp( '([^' + filter_chars + ']*)([' + filter_chars + '])([^' + filter_chars + ']*)', 'g' );

		def( 'filters', filter = F, true );

		return F;
	}
;
	function localize_formats( L ) {
		var F = copy( {
			ISO_8601 : 'Y-m-d<T>H:i:s.u<Z>', ISO_8601_SHORT : 'Y-m-d',
			RFC_850  : 'l, d-M-y H:i:s T',   RFC_2822       : 'D, d M Y H:i:s O',
			sortable : 'Y-m-d H:i:sO'
		}, L.formats );

		F.atom   = F.ISO_8601;
		F.cookie = F.RFC_850;
		F.rss    = F.RFC_2822;

		def( 'formats', formats = F, true );

		return F;
	}
;
	function localize_parsers( L ) {
		var P = {
		// day
			d : { k  : DAY,         fn : Number,                               re : re_d2 },
			D : { k  : DAYWEEK,     fn : _indexOf.bind( null, L.days_short ),  re : '(' + L.days_short.join( '|' ) + ')' },
			j : { k  : DAY,         fn : Number,                               re : re_d1_2 },
			l : { k  : DAYWEEK,     fn : _indexOf.bind( null, L.days ),        re : '(' + L.days.join( '|' ) + ')' },
			N : { k  : DAYWEEK,     fn : _zeroIndexedInt.bind( null, 7 ),      re : '([1-7])' },
			S : { re : '(?:' + L.ordinal.join( '|' ) + ')' },
			w : { k  : DAYWEEK,     fn : Number,                                re : '([0-6])' },
			z : { k  : DAYYEAR,     fn : Number,                                re : '([0-9]{1,3})' },
		// week
			W : { k  : WEEK,        fn : Number,                                re : re_d1_2 },
		// month
			F : { k  : MONTH,       fn : _indexOf.bind( null, L.months ),       re : '(' + L.months.join( '|' ) + ')' },
			m : { k  : MONTH,       fn : _zeroIndexedInt,                       re : re_d2 },
			M : { k  : MONTH,       fn : _indexOf.bind( null, L.months_short ), re : '(' + L.months_short.join( '|' ) + ')' },
			n : { k  : MONTH,       fn : _zeroIndexedInt,                       re : re_d1_2 },
			t : { re : '[0-9]{2}' },
		// year
			L : { re : '(?:0|1)' },
			o : { k  : YEAR,        fn : Number,                                re : re_d4 },
			Y : { k  : YEAR,        fn : Number,                                re : re_d4 },
			y : { k  : YEAR,        fn : function( o ) {
										o = Number( o );
										return o += ( o < 30 ? 2000 : 1900 );
									},                                          re : re_d2 },
		// time
			a : { k  : AMPM,        fn : iter.k,                                re : re_ampm },
			A : { k  : AMPM,        fn : _lc,                                   re : _uc( re_ampm ) },
			g : { k  : HOUR,        fn : _24hrTime,                             re : re_d1_2 },
			G : { k  : HOUR,        fn : Number,                                re : re_d1_2 },
			h : { k  : HOUR,        fn : _24hrTime,                             re : re_d2 },
			H : { k  : HOUR,        fn : Number,                                re : re_d2 },
			i : { k  : MINUTE,      fn : Number,                                re : re_d2 },
			s : { k  : SECOND,      fn : Number,                                re : re_d2 },
			u : { k  : MILLISECOND, fn : Number,                                re : '([0-9]{1,})' },
		// timezone
			O : { k  : TIMEZONE,    fn : _timezoneOffset,                       re : '([\\+-][0-9]{4})' },
			P : { k  : TIMEZONE,    fn : _timezoneOffset,                       re : '([\\+-][0-9]{2}:[0-9]{2})' },
			T : { re : '[A-Z]{1,4}' },
			Z : { k  : TIMEZONE,    fn : _timezoneOffset,                       re : '(Z|[\\+-]?[0-9]{2}:?[0-9]{2})' },
		// full date/time
			U : { k  : UNIX,        fn : Number,                                re : '(-?[0-9]{1,})'  }
		};

		P.c = {
			combo : [P.Y, P.m, P.d, P.H, P.i, P.s, P.u, P.P],
			re    : [P.Y.re, '-', P.m.re, '-', P.d.re, 'T', P.H.re, ':', P.i.re, ':', P.s.re, '(?:\\.', P.u.re, '){0,1}', P.Z.re, '{0,1}'].join( '' )
		};
		P.r = {
			combo : [P.D, P.d, P.M, P.Y, P.H, P.i, P.s, P.O],
			re    : [P.D.re, ', ', P.d.re, ' ', P.M.re, ' ', P.Y.re, ' ', P.H.re, ':', P.i.re, ':', P.s.re, ' ', P.O.re].join( '' )
		};

		def( 'parsers', parser = P, true );

		return P;
	}
;
// constants used by Date.prototype.adjust
	def( 'HOUR',        'hr',                     true );
	def( 'MINUTE',      MINUTE.substring( 0, 3 ), true );
	def( 'MILLISECOND', MILLISECOND,              true );
	def( 'SECOND',      SECOND.substring( 0, 3 ), true );

	module.exports = Date;
