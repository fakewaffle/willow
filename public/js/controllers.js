'use strict';

var projectsControllers = angular.module( 'projectsControllers', [ ] );

projectsControllers.controller( 'ProjectsListController', [ '$scope', '$http', function ( $scope, $http ) {

	$http.get( '/api/projects' ).success( function ( data ) {
		$scope.projects = data;
	} );

} ] );

projectsControllers.controller( 'ProjectsDetailsController', [ '$scope', '$routeParams', '$http', '$q', function ( $scope, $routeParams, $http, $q ) {
	var details = $http.get( '/api/projects/' + $routeParams.projectName );
	var paths   = $http.get( '/api/projects/' + $routeParams.projectName + '/paths' );

	$q.all( { 'details' : details, 'paths' : paths } ).then( function ( results ) {
		$scope.details = results.details.data;
		$scope.paths   = results.paths.data;
	} );

	$scope.name = $routeParams.projectName;

} ] );

projectsControllers.controller( 'PathDetails', [ '$scope', '$routeParams', '$http', '$q', function ( $scope, $routeParams, $http, $q ) {
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

		$scope.halsteadDifficulty = [ {
			'key'    : 'Halstead Difficulty',
			'values' : report.map( function ( value, index ) {
				return [ new Date( value.date ), Math.round( value.aggregate.halstead.difficulty * 10 ) / 10 ];
			} )
		} ];

		$scope.logicalSloc = [ {
			'key'    : 'Logical SLOC',
			'values' : report.map( function ( value, index ) {
				return [ new Date( value.date ), value.aggregate.sloc.logical ];
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
				return [ new Date( value.date ), Math.round( value.aggregate.cyclomatic * 10 ) / 10 ];
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

		$scope.xAxisTickFormat = function () {
			return function ( d ) {
				return d3.time.format( '%x' )( new Date( d ) );
			};
		};

	} );

	$scope.name = $routeParams.projectName;
	$scope.path = $routeParams.path;

} ] );
