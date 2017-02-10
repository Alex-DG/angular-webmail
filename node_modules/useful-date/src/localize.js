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
