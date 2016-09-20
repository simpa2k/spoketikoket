define(function() {

	var app = angular.module('coreModule');
	
	app.factory('DescriptionService', ['$http', '$rootScope', function($http, $rootScope) {
	
	    var descriptionEndpoint = $rootScope.serverRoot + 'description';
	    var promise;
	
	    var descriptionService = {
	        getDescription: function() {
	            if(!promise) {
	                promise = $http.get(descriptionEndpoint).then(function(response) {
	                    return response.data[0]
	                });
	            } return promise;
	        },
			refreshDescription: function() {
	            promise = $http.get(descriptionEndpoint).then(function(response) {
	                return response.data[0]
	            });
	            return promise;
	        }
	    };
	    return descriptionService;
	
	}]);

});