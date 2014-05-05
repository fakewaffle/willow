'use strict';

// Load other modules
var glob       = require( 'glob' );
var loadConfig = require( './loadConfig' );

// Config and options
var config = loadConfig();

module.exports = function getFiles () {
	return glob.sync( config.include ).filter( function ( file ) {
		return !file.match( config.exclude );
	} );
};
