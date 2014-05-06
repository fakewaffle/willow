'use strict';

// Load other modules
var mongoose = require( 'mongoose' );

// Load models
var File = mongoose.model( 'File' );

module.exports = {

	'getFileByChecksum' : function ( request, response, next  ) {
		var conditions = { 'checksum' : request.params.checksum };

		File.findOne( conditions, function ( error, file ) {
			if ( error ) {
				return next( error );
			}

			if ( !file ) {
				return next( 404 );
			}

			response.send( file );
		} );
	}

};
