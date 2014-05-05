'use strict';

module.exports = function log () {
	var whitespace = '';

	var args = Array.prototype.slice.call( arguments, 0 );

	if ( args[ 0 ] === 0 ) {
		console.log();
	} else {
		whitespace = new Array( args[ 0 ] ).join( '   ' );
	}

	args.shift();

	if ( whitespace ) {
		args.unshift( whitespace );
	}

	console.log.apply( null, args );
};
