'use strict';

module.exports = function getProperty ( object, property ) {
	var parts   = property.split( '.' );

	if ( parts.length === 1 ) {
		return object[ property ];
	}

	var last    = parts.pop();
	var length  = parts.length;
	var i       = 1;
	var current = parts[ 0 ];

	while ( ( object = object[ current ] ) && i < length ) {
		current = parts[ i ];
		i++;
	}

	if ( object ) {
		return object[ last ];
	}
};
