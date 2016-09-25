require.config({
	
	paths: {
		'jquery': '../bower_components/jquery/dist/jquery.min',
		'angular': '../bower_components/angular/angular.min',
		'bootstrap-tabs': '../bower_components/bootstrap/js/tab',
		'angular-modal-service': '../bower_components/angular-modal-service/dst/angular-modal-service.min',
		'angular-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
		'angular-scroll': '../bower_components/angular-scroll/angular-scroll.min',
		'ng-parallax': '../bower_components/ng-parallax/angular-parallax.min',
		'ui-router': '../bower_components/angular-ui-router/release/angular-ui-router.min',
		'date-module': 'modules/date-module/date-module',
		'coreModule': 'modules/coreModule/coreModule'
	},

	shim: {
		'angular': {
			deps: ['jquery']
		},
		'bootstrap-tabs': {
			deps: ['jquery']
		},
		'angular-modal-service': {
			deps: ['angular']
		},
		'angular-bootstrap': {
			deps: ['angular']
		},
		'angular-scroll': {
			deps: ['angular']
		},
		'ng-parallax': {
			deps: ['angular-scroll']
		},
		'ui-router': {
			deps: ['angular']
		},
		'date-module': {
			deps: ['angular']
		},
		'coreModule': {
			deps: ['bootstrap-tabs',
				   'angular-modal-service',
				   'angular-bootstrap',
				   'angular-scroll',
				   'ng-parallax',
				   'ui-router',
				   'date-module']
		}
	}

});

require(['coreModule'], function() {

});
