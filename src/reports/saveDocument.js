'use strict';

module.exports = function saveDocument ( document, callback ) {
	document.save( function ( error ) {
		callback( error );
	} );
};
