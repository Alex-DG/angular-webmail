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
