'use strict';

// Load other modules
var log = require( '../common/log' );

module.exports = function saveFile ( file, callback ) {
	file.save( function ( error ) {
		if ( error ) {
			return callback( error );
		}

		callback();
	} );
};
