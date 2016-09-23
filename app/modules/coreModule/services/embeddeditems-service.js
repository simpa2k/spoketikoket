define(function() {

	var app = angular.module('coreModule');
	
	app.factory('EmbeddeditemsService', ['$http', '$rootScope', function($http, $rootScope) {
	
	    var embeddeditemsEndpoint = $rootScope.serverRoot + 'embeddeditems';
		var videosEndpoint = embeddeditemsEndpoint + '?type=video';
		var soundsEndpoint = embeddeditemsEndpoint + '?type=sound';
	    var promise;
		var videosPromise;
		var soundsPromise;

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
	        },
			getVideos: function() {
	        	if(!videosPromise) {
	        		videosPromise = $http.get(videosEndpoint).then(function(response) {
	        			return response.data;
					});
				}
				return videosPromise;
			},
			refreshVideos: function() {
				videosPromise = $http.get(videosEndpoint).then(function(response) {
					return response.data;
				});
				return videosPromise;
			},
			getSounds: function() {
				if(!soundsPromise) {
					soundsPromise = $http.get(soundsEndpoint).then(function(response) {
						return response.data;
					});
				}
				return soundsPromise;
			},
			refreshSounds: function() {
				soundsPromise = $http.get(soundsEndpoint).then(function(response) {
					return response.data;
				});
				return soundsPromise;
			}
	    };
	    return embeddeditemsService;
	
	}]);

});