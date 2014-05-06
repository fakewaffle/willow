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
	var url = '/api/projects/' + $routeParams.projectName + '/complexity-reports/' + $routeParams.path + '/latest';

	$http.get( url ).success( function ( report ) {
		$scope.report = report;

		var url = '/api/files/' + report.checksum;

		$http.get( url ).success( function ( file ) {
			$scope.contents = file.contents;
		} );
	} );

	$scope.name = $routeParams.projectName;
	$scope.path = $routeParams.path;

} ] );
