'use strict';

// Load modules
var path    = require( 'path' );
var glob    = require( 'glob' );
var _       = require( 'lodash' );

var cwd = process.cwd();

module.exports = function ( app ) {
	var controllers = path.join( cwd, 'src', 'controllers' );
	var files       = glob.sync( controllers + '/**/*Controller.js' );

	files.forEach( function ( file ) {
		if ( file.indexOf( cwd + '/index.js' ) >= 0 ) {
			return;
		}

		var routes = require( file );

		routes.forEach( function ( route, index ) {
			var middleware = [ ];

			if ( _.isArray( route.middleware ) ) {
				middleware = middleware.concat( route.middleware );
			} else {
				middleware.push( route.middleware );
			}

			try	{
				app[ route.method ]( '/api/' + route.route, middleware );
			} catch ( error ) {
				throw new Error( 'Could not load ' + route.method.bold + ' ' + route.route.bold + ' for ' + file.bold );
			}

		} );

	} );
};
