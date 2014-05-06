'use strict';

// Load core modules
var fs     = require( 'fs' );
var path   = require( 'path' );

// Load other modules
var async      = require( 'async' );
var mongoose   = require( 'mongoose' );
var escomplex  = require( 'escomplex-js' );
var saveReport = require( './saveReport' );
var saveFile   = require( './saveFile' );
var cb         = require( '../common/cb' );
var log        = require( '../common/log' );
var checksum   = require( '../common/checksum' );

// Load schemas
var Report = mongoose.model( 'Report' );
var File   = mongoose.model( 'File' );

function report ( files, callback ) {

	if ( !files.length ) {
		console.log( 'No files for Complexity Report to check.' );

		return cb();
	}

	var project = path.basename( process.cwd() );
	var now     = new Date();

	log( 0, 'Generating reports for modified files'.bold );

	async.eachSeries( files, function ( file, callback ) {
		var contents = fs.readFileSync( file, 'utf8' );
		var sha1     = checksum( contents );

		var conditions = {
			'path' : file
		};

		var fields  = 'path date checksum';
		var options = { 'sort' : { 'date' : -1 } };

		Report.findOne( conditions, fields, options, function ( error, document ) {
			if ( error ) {
				throw new Error( error );
			}

			if ( document && document.checksum === sha1 ) {
				return callback();
			}

			var ast     = { 'path' : file, 'code' : contents };
			var options = { 'newmi' : true };

			var result = escomplex.analyse( [ ast ], options );

			result.reports.forEach( function ( value, index ) {
				var report = new Report( {
					'project'         : project,
					'path'            : value.path,
					'checksum'        : sha1,
					'date'            : now,
					'maintainability' : value.maintainability,
					'params'          : value.params,
					'aggregate'       : value.aggregate,
					'functions'       : value.functions,
					'dependencies'    : value.dependencies
				} );

				var file = new File( {
					'path'     : value.path,
					'checksum' : sha1,
					'contents' : contents
				} );

				async.series( [

					function ( callback ) {
						saveFile( file, callback );
					},

					function ( callback ) {
						saveReport( report, callback );
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

		cb( callback );
	} );

}

module.exports = report;
