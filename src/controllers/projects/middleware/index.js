'use strict';

// Load other modules
var _ = require( 'lodash' );

module.exports = _.merge(
	require( './complexity-reports' ),
	require( './reports' )
);
