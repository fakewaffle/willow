'use strict';

// Load modules
var middleware = require( './middleware' );

module.exports = [

	{
		'method'     : 'get',
		'route'      : 'projects',
		'middleware' : middleware.getAllProjects
	},

	{
		'method'     : 'get',
		'route'      : 'projects/:project',
		'middleware' : middleware.getProjectOverview
	},

	{
		'method'     : 'get',
		'route'      : 'projects/:project/paths',
		'middleware' : middleware.getPathsForProject
	},

	{
		'method'     : 'get',
		'route'      : 'projects/:project/complexity-reports/:reportId',
		'middleware' : require( '../complexity-reports/middleware' ).getComplexityReportById
	},

	{
		'method'     : 'get',
		'route'      : 'projects/:project/complexity-reports/paths/*',
		'middleware' : middleware.getProjectComplexityReportByPath
	}

];
