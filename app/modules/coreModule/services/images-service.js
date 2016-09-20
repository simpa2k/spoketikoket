define(function() {

	var app = angular.module('coreModule');
	
	app.factory('ImagesService', ['$http', '$rootScope', function($http, $rootScope) {
	
	    var imagesEndpoint = $rootScope.serverRoot + 'images';
	    var promise;
	
	    var imagesService = {
	        getImages: function() {
	            if(!promise) {
	                promise = $http.get(imagesEndpoint).then(function(response) {
	                    return response.data
	                });
	            } return promise;
	        },
			refreshImages: function() {
	            promise = $http.get(imagesEndpoint).then(function(response) {
	                return response.data
	            });
	            return promise;
	        }
	    };
	    return imagesService;
	
	}]);

});