require.config({
	
	paths: {
		'jquery': '../bower_components/jquery/dist/jquery.min',
		'angular': '../bower_components/angular/angular.min',
		'angular-scroll': '../bower_components/angular-scroll/angular-scroll.min',
		'ng-parallax': '../bower_components/ng-parallax/angular-parallax.min',
		'ui-router': '../bower_components/angular-ui-router/release/angular-ui-router.min',
		'coreModule': 'modules/coreModule/coreModule'
	},

	shim: {
		'angular': {
			deps: ['jquery']
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
		'coreModule': {
			deps: ['angular-scroll',
				   'ng-parallax',
				   'ui-router']
		}
	}

});

require(['coreModule'], function() {

});
