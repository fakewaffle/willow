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
		'route'      : 'projects/:project/complexity-reports',
		'middleware' : middleware.getAllProjectComplexityReports
	},

	{
		'method'     : 'get',
		'route'      : 'projects/:project/complexity-reports/*/latest',
		'middleware' : middleware.getLatestComplexityReportByProjectAndPath
	},

	{
		'method'     : 'get',
		'route'      : 'projects/:project/complexity-reports/*',
		'middleware' : middleware.getComplexityReportsByProjectAndPath
	}

];
