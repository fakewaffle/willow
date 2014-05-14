'use strict';

// Load other modules
var mongoose = require( 'mongoose' );

 // Load models
var Report = mongoose.model( 'Report' );

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
		var conditions = { 'project' : request.params.project };
		var fields     = null;

		Report.findOne( conditions, fields, options, function ( error, report ) {
			if ( error ) {
				return next( error );
			}

			if ( !report ) {
				return next( 404 );
			}

			response.send( report );

		} );

	},

	'getProjectAverages' : function ( request, response, next ) {
		var conditions = { 'project' : request.params.project };
		var fields     = 'date averages';

		Report.find( conditions, fields, function ( error, reports ) {
			if ( error ) {
				return next( error );
			}

			if ( !reports.length ) {
				return next( 404 );
			}

			var averages = reports.map( function ( report ) {
				var average = report.averages;

				average.date = report.date;

				return average;
			} );

			response.send( averages );

		} );
	}

};
