'use strict';

// Load other modules
var mongoose = require( 'mongoose' );
var log      = require( './log' );

module.exports = function startMongoose ( callback ) {
	mongoose.connect( 'mongodb://localhost/willow', function ( error ) {
		if ( error ) {
			throw new Error( error );
		}

		require( '../bootstrap/schemas' )();

		log( 0, 'Mongoose connected to localhost/willow'.bold );

		callback();
	} );
};
