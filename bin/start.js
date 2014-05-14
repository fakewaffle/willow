'use strict';

// Load other modules
var startMongoose = require( '../src/common/startMongoose' );
var startExpress  = require( '../src/common/startExpress' );

startMongoose( function () {
	startExpress( function () { } );
} );
