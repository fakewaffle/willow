'use strict';

// Load other modules
var log = require( '../common/log' );

module.exports = function saveReport ( report, callback ) {
	report.save( function ( error ) {
		if ( error ) {
			return callback( error );
		}

		callback();
	} );
};
