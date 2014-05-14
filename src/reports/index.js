'use strict';

// Load core modules
var fs     = require( 'fs' );
var path   = require( 'path' );

// Load other modules
var async     = require( 'async' );
var mongoose  = require( 'mongoose' );
var escomplex = require( 'escomplex-js' );

require( 'colors' );

// Load local files
var saveDocument = require( './saveDocument' );
var cb           = require( '../common/cb' );
var log          = require( '../common/log' );
var checksum     = require( '../common/checksum' );
var getProperty  = require( '../common/getProperty' );

// Load schemas
var Report           = mongoose.model( 'Report' );
var ComplexityReport = mongoose.model( 'ComplexityReport' );
var File             = mongoose.model( 'File' );

function report ( files, callback ) {

	if ( !files.length ) {
		console.log( 'No files for Complexity Report to check.' );

		return cb();
	}

	var now = new Date();
	if ( process.env.WILLOW_DATE ) {
		now = new Date( process.env.WILLOW_DATE );
	}

	var project      = path.basename( process.cwd() );
	var paths        = [ ];
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

			var results;

			var ast     = { 'path' : file, 'code' : contents };
			var options = { 'newmi' : true };

			try {
				results = escomplex.analyse( [ ast ], options );
			} catch ( error ) {
				return callback();
			}

			try {
				var BreakException = { };

				results.reports.forEach( function ( result, index ) {

					// Push in all data so we can compute averages for the report
					if ( file && sha1 && result && result.maintainability && result.aggregate ) {
						paths.push( {
							'path'            : file,
							'checksum'        : sha1,
							'maintainability' : result.maintainability,
							'aggregate'       : result.aggregate
						} );
					}

					// Don't continue to run the complexity report for a file that has not changed
					// We stop here so we can compute the averages
					if ( document && document.checksum === sha1 ) {
						throw BreakException;
					}

					changedPaths.push( {
						'path'     : file,
						'checksum' : sha1
					} );

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
								'maintainability' : result.maintainability,
								'params'          : result.params,
								'aggregate'       : result.aggregate,
								'functions'       : result.functions,
								'dependencies'    : result.dependencies
							} ), callback );
						}

					], function ( error, results ) {
						if ( !error ) {
							log( 2, result.path.green );
						}

						callback( error );
					} );

				} );
			} catch ( error ) {
				callback();
			}

		} );

	}, function ( error ) {
		if ( error ) {
			throw new Error( error );
		}

		function setAverage ( value, nested ) {
			var average = 0;

			paths.forEach( function ( path, index ) {
				average += getProperty( path, nested );
			} );

			averages[ value ] = average / ( paths.length + 1 );
		}

		if ( allPaths.length && changedPaths.length ) {
			var averages = { };

			setAverage( 'maintainability', 'maintainability' );
			setAverage( 'logicalSloc', 'aggregate.sloc.logical' );
			setAverage( 'cyclomatic', 'aggregate.cyclomatic' );
			setAverage( 'halsteadTime', 'aggregate.halstead.time' );

			return saveDocument( new Report( {
				'project'      : project,
				'date'         : now,
				'paths'        : allPaths,
				'changedPaths' : changedPaths,
				'averages'     : averages
			} ), callback );
		}

		cb( callback );
	} );

}

module.exports = report;
