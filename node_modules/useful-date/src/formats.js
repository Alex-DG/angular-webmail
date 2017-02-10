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
