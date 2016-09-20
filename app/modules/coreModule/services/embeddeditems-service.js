define(function() {

	var app = angular.module('coreModule');
	
	app.factory('EmbeddeditemsService', ['$http', '$rootScope', function($http, $rootScope) {
	
	    var embeddeditemsEndpoint = $rootScope.serverRoot + 'embeddeditems';
	    var promise;
	
	    var embeddeditemsService = {
	        getEmbeddeditems: function() {
	            if(!promise) {
	                promise = $http.get(embeddeditemsEndpoint).then(function(response) {
	                    return response.data
	                });
	            } return promise;
	        },
			refreshEmbeddeditems: function() {
	            promise = $http.get(embeddeditemsEndpoint).then(function(response) {
	                return response.data
	            });
	            return promise;
	        }
	    };
	    return embeddeditemsService;
	
	}]);

});