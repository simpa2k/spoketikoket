require.config({
	
	paths: {
		'jquery': '/bower_components/jquery/dist/jquery.min',
		'angular': '/bower_components/angular/angular.min',
		'ui-router': '/bower_components/angular-ui-router/release/angular-ui-router.min',
		'coreModule': 'modules/coreModule/coreModule'
	},

	shim: {
		'angular': {
			deps: ['jquery']
		},
		'ui-router': {
			deps: ['angular']
		},
		'coreModule': {
			deps: ['ui-router']
		}
	}

});

require(['coreModule'], function() {

});
