'use strict';

// Load modules
var path   = require( 'path' );
var glob   = require( 'glob' );

module.exports = function () {
	var files = glob.sync( path.join( __dirname, '../schemas/*Schema.js' ) );

	files.forEach( function ( file ) {
		require( file );
	} );
};
