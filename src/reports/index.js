'use strict';

// Load core modules
var fs     = require( 'fs' );
var path   = require( 'path' );

// Load other modules
var async     = require( 'async' );
var mongoose  = require( 'mongoose' );
var escomplex = require( 'escomplex-js' );
var cb        = require( '../common/cb' );
var log       = require( '../common/log' );
var checksum  = require( '../common/checksum' );

// Load schemas
var Report = mongoose.model( 'Report' );

function saveReport ( report, callback ) {
	report.save( function ( error ) {
		if ( error ) {
			return callback( error );
		}

		log( 2, report.path.green );

		callback();
	} );
}

function report ( files, callback ) {

	if ( !files.length ) {
		console.log( 'No files for Complexity Report to check.' );

		return cb();
	}

	var project = path.basename( process.cwd() );
	var now     = new Date();
	var options = { 'newmi' : true };

	log( 0, 'Generating reports for modified files'.bold );

	async.eachSeries( files, function ( file, callback ) {
		var contents = fs.readFileSync( file, 'utf8' );
		var sha1     = checksum( contents );

		var conditions = {
			'path'     : file,
			'checksum' : sha1
		};

		Report.findOne( conditions, function ( error, report ) {
			if ( error ) {
				throw new Error( error );
			}

			if ( report ) {
				return callback();
			}

			var ast = {
				'path' : file,
				'code' : contents
			};

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

				saveReport( report, callback );

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
