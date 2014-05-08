'use strict';

// Load other modules
var mongoose = require( 'mongoose' );

// Load models
var ComplexityReport = mongoose.model( 'ComplexityReport' );

var fields = {
	'dependencies' : 0,
	'functions'    : 0,
	'aggregate'    : 0
};

var options = { 'sort' : { 'date' : -1 } };

module.exports = {

	'getAllProjectComplexityReports' : function ( request, response, next  ) {
		var conditions = { 'project' : request.params.project };
		var options    = { 'sort' : { 'path' : 1, 'date' : -1 } };

		ComplexityReport.find( conditions, fields, options, function ( error, reports ) {
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

		var options = { 'sort' : { 'date' : 1 } };

		ComplexityReport.find( conditions, null, options, function ( error, reports ) {
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

		ComplexityReport.findOne( conditions, null, options, function ( error, report ) {
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
