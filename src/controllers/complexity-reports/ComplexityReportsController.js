'use strict';

// Load modules
var middleware = require( './middleware' );

module.exports = [

	{
		'method'     : 'get',
		'route'      : 'complexity-reports',
		'middleware' : middleware.getAllComplexityReports
	},

	{
		'method'     : 'get',
		'route'      : 'complexity-reports/:reportId',
		'middleware' : middleware.getComplexityReportById
	}

];
