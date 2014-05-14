'use strict';

// Load core modules
var exec = require( 'child_process' ).exec;

// Load other modules
var async = require( 'async' );

require( 'colors' );

function reset ( callback ) {
	console.log( 'Reseting' );
	exec( 'git reset --hard; git ck dev', callback );
}

function log ( callback ) {
	console.log( 'Getting all commits' );
	exec( 'git log --pretty=format:"%H"', callback );
}

function loopOverCommits ( commits ) {
	console.log( 'Looping over each commit' );

	async.eachSeries( commits, function ( commit, callback ) {

		exec( 'git log ' + commit + ' -1 --pretty=format:"%ai"', function ( error, stdout, stderr ) {
			if ( error ) {
				return callback( error );
			}

			console.log();
			console.log( ( commit + ': ' + stdout ).underline.bold );

			exec( 'git checkout ' + commit + '; willow cr --date "' + stdout + '"', function ( error, stdout, stderr ) {
				if ( error ) {
					return callback( error );
				}

				console.log( stdout );

				callback();
			} );
		} );

	}, function ( error ) {
		if ( error ) {
			throw new Error( error );
		}
	} );
}

reset( function ( error, stdout, stderr ) {
	console.log( stdout );

	log( function ( error, stdout, stderr ) {
		if ( error ) {
			throw new Error( error );
		}

		loopOverCommits( stdout.split( '\n' ).reverse() );
	} );
} );
