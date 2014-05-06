'use strict';

// Load modules
var middleware = require( './middleware' );

module.exports = [

	{
		'method'     : 'get',
		'route'      : 'files/:checksum',
		'middleware' : middleware.getFileByChecksum
	}

];
