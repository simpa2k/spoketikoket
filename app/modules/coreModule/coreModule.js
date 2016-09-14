define(function() {

	var coreModule = angular.module('coreModule', ['ui.router']);

	coreModule.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'partials/home.html',
				controller: 'mainController'
			});
	});

	require(['modules/coreModule/references'], function(references) {
		require(references, function() {
			angular.bootstrap(document, ['coreModule']);
		});
	});

});
