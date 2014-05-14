'use strict';

// Load other modules
var getFiles      = require( '../src/common/getFiles' );
var startMongoose = require( '../src/common/startMongoose' );

startMongoose( function () {
	var cr = require( '../src/reports' );

	cr( getFiles(), function () {
		process.exit();
	} );
} );
