define(['modules/coreModule/runners/authenticationRunner', 'modules/coreModule/runners/rootScopeRunner'], function(authenticationRunner, rootScopeRunner) {

	var coreModule = angular.module('coreModule', ['lr.upload',
												   'ui.router',
												   'ui.bootstrap',
												   'ui.tinymce',
												   'ngSanitize',
												   'angularModalService',
												   'duParallax',
												   'DateModule',
												   'AuthenticationModule']);

    coreModule.factory('sessionInjector', ['$injector', function($injector) {
        var sessionInjector = {
            request: function(config) {
                var SendObjectService = $injector.get('SendObjectService');
                var requestMethod = config.method;
                var authenticationRequired = (requestMethod == "POST") || (requestMethod == "PUT") || (requestMethod == "DELETE");

                if(authenticationRequired) {
                    var session = {
                        username: localStorage.getItem('username'),
                        token: localStorage.getItem('token')
                    };
                    config.url = SendObjectService.appendToUri(config.url, session);
                }
                return config;
            }
        };
        return sessionInjector;
    }]);

	coreModule.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', function($stateProvider, $urlRouterProvider, $httpProvider) {
		$urlRouterProvider.otherwise('/home');

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: 'partials/home.html',
				controller: 'MainController',
				data: {
					requireLogin: false
				}
			})

			.state('login', {
				url: '/login',
				templateUrl: 'partials/login.html',
				controller: 'LoginController',
				data: {
					requireLogin: false
				}
			})

			.state('admin', {
				abstract: true,
				url: '/admin',
				templateUrl: 'partials/admin.html',
				data: {
					requireLogin: true
				}
			})

			.state('admin.dashboard', {
				url: '/dashboard',
				templateUrl: 'partials/admin-dashboard.html',
				controller: 'AdminController'
			})

			.state('admin.gigs', {
				url: '/gigs',
				templateUrl: 'partials/admin-gigs.html',
				controller: 'AdminGigsController'
			})

			.state('admin.description', {
				url: '/description',
				templateUrl: 'partials/admin-description.html',
				controller: 'AdminDescriptionController'
			})

			.state('admin.members', {
				url: '/members',
				templateUrl: 'partials/admin-members.html',
				controller: 'AdminMembersController'
			})

			.state('admin.galleries', {
				url: '/galleries',
				templateUrl: 'partials/admin-galleries.html',
				controller: 'AdminGalleriesController'
			})

			.state('admin.embeddeditems', {
				url: '/embeddeditems',
				templateUrl: 'partials/admin-embeddeditems.html',
				controller: 'AdminEmbeddeditemsController'
			})

			.state('admin.contact', {
				url: '/contact',
				templateUrl: 'partials/admin-contact.html',
				controller: 'AdminContactpersonsController'
			})

			.state('admin.announcements', {
				url:'/announcements',
				template: '<admin-page items="items" form-structure="formStructure" form-name="{{ formName }}" entity-name="{{ entityName }}"></admin-page>',
				controller: 'AdminAnnouncementsController'
			});

		$httpProvider.interceptors.push('sessionInjector');
	}]);

	coreModule.run(authenticationRunner);
	coreModule.run(rootScopeRunner);

	require(['modules/coreModule/references'], function(references) {
		require(references, function() {
			angular.bootstrap(document, ['coreModule']);
		});
	});

});
