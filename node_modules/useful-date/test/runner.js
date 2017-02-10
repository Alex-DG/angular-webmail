chai     = require( 'chai' );
expect   = chai.expect;

require( '../index' );

require( '../locale/en-GB' );
require( '../locale/en-US' );
require( '../locale/GR' );

require( './date.test' );
require( './locale/date.en-US.test' );
require( './locale/date.GR.test' );
