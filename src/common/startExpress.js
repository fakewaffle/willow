'use strict';

// Load core modules
var path = require( 'path' );

// Load other modules
var express   = require( 'express' );
var directory = require( 'serve-index' );
var log       = require( './log' );
var app       = express();

app.use( express.static( path.join( __dirname, '../../public' ) ) );
app.use( directory( path.join( __dirname, '../../public' ), { 'icons' : true } ) );

module.exports = function startMongoose ( callback ) {
	app.listen( 3000, function ( error ) {
		if ( error ) {
			throw new Error( error );
		}

		require( '../bootstrap/controllers' )( app );

		log( 0, 'Server started on port 3000'.bold );
	} );
};
