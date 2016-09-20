define(['modules/coreModule/runners/rootScopeRunner'], function(rootScopeRunner) {

	var coreModule = angular.module('coreModule', ['ui.router', 'duParallax']);

	coreModule.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'partials/home.html',
				controller: 'MainController'
			});
	});

	coreModule.run(rootScopeRunner);

	require(['modules/coreModule/references'], function(references) {
		require(references, function() {
			angular.bootstrap(document, ['coreModule']);
		});
	});

});
