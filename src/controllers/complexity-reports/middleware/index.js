'use strict';

// Load other modules
var mongoose = require( 'mongoose' );

// Load models
var ComplexityReport = mongoose.model( 'ComplexityReport' );

var fields = '';
var fields = 'project path date maintainability';

module.exports = {

	'getAllComplexityReports' : function ( request, response, next  ) {
		var conditions = { };

		ComplexityReport.find( conditions, fields, function ( error, reports ) {
			if ( error ) {
				return next( error );
			}

			response.send( reports );
		} );
	},

	'getComplexityReportById' : function ( request, response, next  ) {
		ComplexityReport.findById( request.params.reportId, function ( error, report ) {
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
