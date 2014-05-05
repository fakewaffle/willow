'use strict';

// Load other modules
var mongoose = require( 'mongoose' );

// Load models
var Report = mongoose.model( 'Report' );

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

	'getProjectComplexityReportByPath' : function ( request, response, next  ) {
		var path = request.params[ 0 ];

		var conditions = {
			'project' : request.params.project,
			'path'    : path
		};

		var fields = {
			'dependencies' : 0,
			'functions'    : 0,
			'aggregate'    : 0
		};

		Report.find( conditions, fields, { 'sort' : { 'date' : -1 } }, function ( error, report ) {
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
