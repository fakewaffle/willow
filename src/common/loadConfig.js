'use strict';

// Load core modules
var path = require( 'path' );
var fs   = require( 'fs' );

module.exports = function loadConfig () {
	try {
		return JSON.parse( fs.readFileSync( path.join( process.cwd(), '.willowrc' ) ) );
	} catch ( error ) {
		throw new Error( 'Could not find or parse .willowrc' );
	}
};
