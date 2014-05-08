'use strict';

// Load core modules
var fs     = require( 'fs' );
var path   = require( 'path' );

// Load other modules
var async     = require( 'async' );
var mongoose  = require( 'mongoose' );
var escomplex = require( 'escomplex-js' );

// Load local files
var saveDocument = require( './saveDocument' );
var cb           = require( '../common/cb' );
var log          = require( '../common/log' );
var checksum     = require( '../common/checksum' );

// Load schemas
var Report           = mongoose.model( 'Report' );
var ComplexityReport = mongoose.model( 'ComplexityReport' );
var File             = mongoose.model( 'File' );

function report ( files, callback ) {

	if ( !files.length ) {
		console.log( 'No files for Complexity Report to check.' );

		return cb();
	}

	var project      = path.basename( process.cwd() );
	var now          = new Date();
	var allPaths     = [ ];
	var changedPaths = [ ];

	log( 0, 'Generating reports for modified files'.bold );

	async.eachSeries( files, function ( file, callback ) {
		var contents = fs.readFileSync( file, 'utf8' );
		var sha1     = checksum( contents );

		allPaths.push( {
			'path'     : file,
			'checksum' : sha1
		} );

		var conditions = { 'path' : file };
		var fields     = 'path date checksum';
		var options    = { 'sort' : { 'date' : -1 } };

		ComplexityReport.findOne( conditions, fields, options, function ( error, document ) {
			if ( error ) {
				throw new Error( error );
			}

			// Don't run the complexity report for a file that has not changed
			if ( document && document.checksum === sha1 ) {
				return callback();
			}

			changedPaths.push( {
				'path'     : file,
				'checksum' : sha1
			} );

			var ast     = { 'path' : file, 'code' : contents };
			var options = { 'newmi' : true };

			var result = escomplex.analyse( [ ast ], options );

			result.reports.forEach( function ( value, index ) {

				async.series( [

					function ( callback ) {
						saveDocument( new File( {
							'path'     : file,
							'checksum' : sha1,
							'contents' : contents
						} ), callback );
					},

					function ( callback ) {
						saveDocument( new ComplexityReport( {
							'project'         : project,
							'path'            : file,
							'checksum'        : sha1,
							'date'            : now,
							'maintainability' : value.maintainability,
							'params'          : value.params,
							'aggregate'       : value.aggregate,
							'functions'       : value.functions,
							'dependencies'    : value.dependencies
						} ), callback );
					}

				], function ( error, results ) {
					if ( !error ) {
						log( 2, value.path.green );
					}

					callback( error );
				} );

			} );

		} );

	}, function ( error ) {
		if ( error ) {
			throw new Error( error );
		}

		if ( allPaths.length && changedPaths.length ) {
			return saveDocument( new Report( {
				'project'      : project,
				'date'         : now,
				'paths'        : allPaths,
				'changedPaths' : changedPaths
			} ), callback );
		}

		cb( callback );
	} );

}

module.exports = report;
