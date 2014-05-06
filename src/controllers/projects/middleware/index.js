'use strict';

// Load other modules
var mongoose = require( 'mongoose' );

// Load models
var Report = mongoose.model( 'Report' );

var fields = {
	'dependencies' : 0,
	'functions'    : 0,
	'aggregate'    : 0
};

var options = { 'sort' : { 'date' : -1 } };

module.exports = {

	'getAllProjects' : function ( request, response, next ) {
		Report.find( { } ).distinct( 'project', function ( error, projects ) {
			if ( error ) {
				return next( error );
			}

			response.send( projects );
		} );
	},

	'getProjectOverview' : function ( request, response, next  ) {
		response.send( { 'message' : 'todo' } );
	},

	'getPathsForProject' : function ( request, response, next  ) {
		var conditions = { 'project' : request.params.project };

		Report.find( conditions ).distinct( 'path', function ( error, paths ) {
			if ( error ) {
				return next( error );
			}

			response.send( paths );
		} );
	},

	'getAllProjectComplexityReports' : function ( request, response, next  ) {
		var conditions = { 'project' : request.params.project };
		var options    = { 'sort' : { 'path' : 1, 'date' : -1 } };

		Report.find( conditions, fields, options, function ( error, reports ) {
			if ( error ) {
				return next( error );
			}

			response.send( reports );
		} );
	},

	'getComplexityReportsByProjectAndPath' : function ( request, response, next  ) {
		var conditions = {
			'project' : request.params.project,
			'path'    : request.params[ 0 ]
		};

		Report.find( conditions, fields, options, function ( error, reports ) {
			if ( error ) {
				return next( error );
			}

			response.send( reports );
		} );
	},

	'getLatestComplexityReportByProjectAndPath' : function ( request, response, next  ) {
		var conditions = {
			'project' : request.params.project,
			'path'    : request.params[ 0 ]
		};

		Report.findOne( conditions, null, options, function ( error, report ) {
			if ( error ) {
				return next( error );
			}

			if ( !report ) {
				return next( 404 );
			}

			response.send( report );
		} );
	}

};
