define(['modules/coreModule/runners/rootScopeRunner'], function(rootScopeRunner) {

	var coreModule = angular.module('coreModule', ['angularModalService', 'ui.bootstrap', 'ui.router', 'duParallax', 'DateModule']);

	coreModule.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/home');

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'partials/home.html',
				controller: 'MainController'
			})

			.state('galleries', {
				url: '/galleries?name',
				templateUrl: 'partials/gallery-page.html',
				controller: 'GalleryController'
			});
	});

	coreModule.run(rootScopeRunner);

	require(['modules/coreModule/references'], function(references) {
		require(references, function() {
			angular.bootstrap(document, ['coreModule']);
		});
	});

});
