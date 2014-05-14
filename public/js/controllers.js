'use strict';

function xAxisTickFormat () {
	return function ( value ) {
		return d3.time.format( '%x' )( new Date( value ) );
	};
}

function yAxisTickFormat () {
	return function ( value ) {
		return value.toFixed( 1 );
	};
}

// Related to duplicate values in x. Maybe relevant?:
// http://stackoverflow.com/questions/21075245/nvd3-prevent-repeated-values-on-y-axis
// http://stackoverflow.com/questions/21667424/duplicate-dates-on-x-axis
function hack ( value ) {
	return value + Math.random() / 1000;
}

var projectsControllers = angular.module( 'projectsControllers', [ ] );

projectsControllers.controller( 'ProjectsListController', function ( $scope, $http ) {

	$http.get( '/api/projects' ).success( function ( data ) {
		$scope.projects = data;
	} );

} );

projectsControllers.controller( 'ProjectsDetailsController', function ( $scope, $routeParams, $http, $q ) {
	var requests = {
		'details'  : $http.get( '/api/projects/' + $routeParams.projectName ),
		'averages' : $http.get( '/api/projects/' + $routeParams.projectName + '/averages' )
	};

	$scope.name            = $routeParams.projectName;
	$scope.xAxisTickFormat = xAxisTickFormat;
	$scope.yAxisTickFormat = yAxisTickFormat;

	$q.all( requests ).then( function ( response ) {
		$scope.fileCount    = Object.keys( response.details.data.paths ).length + 1;
		$scope.averages     = response.details.data.averages;
		$scope.changedPaths = response.details.data.changedPaths;
		$scope.paths        = response.details.data.paths;

		var averages = response.averages.data;

		// function uniq ( name ) {
		// 	return _.uniq( averages.map( function ( value, index ) {
		// 		return {
		// 			'date'  : value.date,
		// 			'value' : value[ name ]
		// 		};
		// 	} ), 'value' );
		// }

		$scope.maintainability = [ {
			'key'    : 'Maintainability',
			'values' : averages.map( function ( value, index ) {
				return [ index, value.maintainability ];
			} )
		} ];

		$scope.complexity = [ {
			'key'    : 'Cyclomatic Complexity',
			'values' : averages.map( function ( value, index ) {
				return [ index, value.cyclomatic ];
			} )
		} ];

		$scope.halsteadTime = [ {
			'key'    : 'Halstead Time',
			'values' : averages.map( function ( value, index ) {
				return [ index, value.halsteadTime / 60 ];
			} )
		} ];

		$scope.logicalSloc = [ {
			'key'    : 'Logical SLOC',
			'values' : averages.map( function ( value, index ) {
				return [ index, value.logicalSloc ];
			} )
		} ];

	} );

} );

projectsControllers.controller( 'PathDetails', function ( $scope, $routeParams, $http, $q ) {
	var url = '/api/projects/' + $routeParams.projectName + '/complexity-reports/' + $routeParams.path;

	$http.get( url + '/latest' ).success( function ( report ) {
		$scope.report = report;

		var url = '/api/files/' + report.checksum;

		$http.get( url ).success( function ( file ) {
			$scope.contents = file.contents;

			// Hack until I learn about directives and crappy $timeout
			var editor = ace.edit( 'code' );
			editor.setReadOnly( true );
			editor.setShowPrintMargin( false );
			editor.setValue( file.contents );
			editor.clearSelection();
			editor.getSession().setMode( 'ace/mode/javascript' );
			editor.setOptions( {
				'maxLines' : Infinity
			} );

		} );
	} );

	$http.get( url ).success( function ( report ) {
		$scope.xAxisTickFormat = xAxisTickFormat;

		$scope.halsteadDifficulty = [ {
			'key'    : 'Halstead Difficulty',
			'values' : report.map( function ( value, index ) {
				return [ new Date( value.date ), Math.round( value.aggregate.halstead.difficulty * 10 ) / 10 ];
			} )
		} ];

		$scope.halsteadTime = [ {
			'key'    : 'Halstead Time',
			'values' : report.map( function ( value, index ) {
				return [ new Date( value.date ), Math.round( value.aggregate.halstead.time / 60 * 10 ) / 10 ];
			} )
		} ];

		$scope.logicalSloc = [ {
			'key'    : 'Logical SLOC',
			'values' : report.map( function ( value, index ) {
				return [ new Date( value.date ), value.aggregate.sloc.logical ];
			} )
		} ];

		$scope.physicalSloc = [ {
			'key'    : 'Physical SLOC',
			'values' : report.map( function ( value, index ) {
				return [ new Date( value.date ), value.aggregate.sloc.physical ];
			} )
		} ];

		$scope.maintainability = [ {
			'key'    : 'Maintainability',
			'values' : report.map( function ( value, index ) {
				return [ new Date( value.date ), Math.round( value.maintainability * 10 ) / 10 ];
			} )
		} ];

		$scope.complexity = [ {
			'key'    : 'Complexity',
			'values' : report.map( function ( value, index ) {
				return [ new Date( value.date ), value.aggregate.cyclomatic ];
			} )
		} ];

		$scope.dependencies = [ {
			'key'    : 'Dependencies',
			'values' : report.map( function ( value, index ) {
				return [ new Date( value.date ), value.dependencies.length ];
			} )
		} ];

		$scope.functions = [ {
			'key'    : 'Functions',
			'values' : report.map( function ( value, index ) {
				return [ new Date( value.date ), value.functions.length ];
			} )
		} ];

	} );

	$scope.name = $routeParams.projectName;
	$scope.path = $routeParams.path;

} );

