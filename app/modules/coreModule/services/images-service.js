define(function() {

	var app = angular.module('coreModule');
	
	app.factory('ImagesService', ['$http', '$rootScope', function($http, $rootScope) {
	
	    var imagesEndpoint = $rootScope.serverRoot + 'images';
		var albumsEndpoint = imagesEndpoint  + '/albums';
		var albumCoversEndpoint = imagesEndpoint  + '/albumcovers';
	    var imagesPromise;
		var albumsPromise;
		var albumCoversPromise;

	    var imagesService = {
	        getImages: function() {
	            if(!imagesPromise) {
	                imagesPromise = $http.get(imagesEndpoint).then(function(response) {
	                    return response.data
	                });
	            } return imagesPromise;
	        },
			refreshImages: function() {
	            imagesPromise = $http.get(imagesEndpoint).then(function(response) {
	                return response.data
	            });
	            return imagesPromise;
	        },
			getAlbums: function() {
				if(!albumsPromise) {
					albumsPromise = $http.get(albumsEndpoint).then(function(response) {
						return response.data
					});
				} return albumsPromise;
			},
			refreshAlbums: function() {
				albumsPromise = $http.get(albumsEndpoint).then(function(response) {
					return response.data
				});
				return albumsPromise;
			},
			getAlbumCovers: function() {
				if(!albumCoversPromise) {
					albumsCoversPromise = $http.get(albumCoversEndpoint).then(function(response) {
						return response.data
					});
				} return albumsCoversPromise;
			},
			refreshAlbumCovers: function() {
				albumCoversPromise = $http.get(albumCoversEndpoint).then(function(response) {
					return response.data
				});
				return albumCoversPromise;
			}
	    };
	    return imagesService;
	
	}]);

});