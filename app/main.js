require.config({
	
	paths: {
		'jquery': '../bower_components/jquery/dist/jquery.min',
		'angular': '../bower_components/angular/angular.min',
		'bootstrap-tabs': '../bower_components/bootstrap/js/tab',
		'tinymce': '../bower_components/tinymce/tinymce.min',
		'angular-tinymce': '../bower_components/angular-ui-tinymce/dist/tinymce.min',
		'ui-router': '../bower_components/angular-ui-router/release/angular-ui-router.min',
		'angular-modal-service': '../bower_components/angular-modal-service/dst/angular-modal-service.min',
		'angular-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls.min',
		'angular-scroll': '../bower_components/angular-scroll/angular-scroll.min',
		'ng-parallax': '../bower_components/ng-parallax/angular-parallax.min',
		'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize.min',
		'date-module': 'modules/date-module/date-module',
		'authentication-module': 'modules/authentication-module/authentication-module',
		'coreModule': 'modules/coreModule/coreModule'
	},

	shim: {
		'angular': {
			deps: ['jquery']
		},
		'bootstrap-tabs': {
			deps: ['jquery']
		},
		'angular-tinymce': {
			deps: ['angular', 'tinymce']
		},
		'ui-router': {
			deps: ['angular']
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
		'angular-sanitize': {
			deps: ['angular']
		},
		'date-module': {
			deps: ['angular']
		},
		'authentication-module': {
			deps: ['angular']
		},
		'coreModule': {
			deps: ['ui-router',
				   'bootstrap-tabs',
				   'angular-tinymce',
				   'angular-modal-service',
				   'angular-bootstrap',
				   'angular-scroll',
				   'ng-parallax',
				   'angular-sanitize',
				   'date-module',
				   'authentication-module']
		}
	}

});

require(['coreModule'], function() {

});
