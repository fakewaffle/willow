'use strict';

// Load core modules
var crypto = require( 'crypto' );

module.exports = function checksum ( contents ) {
	return crypto.createHash( 'sha1' ).update( contents, 'utf8' ).digest( 'hex' );
};
