'use strict';

var willowApp = angular.module( 'willowApp', [
	'ngRoute',
	'projectsControllers',
	'nvd3ChartDirectives'
] );

willowApp.config( [ '$routeProvider', function ( $routeProvider ) {

	$routeProvider

		.when( '/projects', {
			'controller'  : 'ProjectsListController',
			'templateUrl' : '/partials/projects-list.html'
		} )

		.when( '/projects/:projectName', {
			'controller'  : 'ProjectsDetailsController',
			'templateUrl' : '/partials/projects-details.html'
		} )

		.when( '/projects/:projectName/complexity-reports/:path*/latest', {
			'controller'  : 'PathDetails',
			'templateUrl' : '/partials/path-details.html'
		} );

} ] );
