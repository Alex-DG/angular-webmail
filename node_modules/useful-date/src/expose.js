// constants used by Date.prototype.adjust
	def( 'HOUR',        'hr',                     true );
	def( 'MINUTE',      MINUTE.substring( 0, 3 ), true );
	def( 'MILLISECOND', MILLISECOND,              true );
	def( 'SECOND',      SECOND.substring( 0, 3 ), true );

	module.exports = Date;
