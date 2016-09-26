define(function() {

	var app = angular.module('coreModule');
	
	app.factory('ImagesService', ['$http', '$rootScope', function($http, $rootScope) {
	
	    var imagesEndpoint = $rootScope.serverRoot + 'images';
		var galleriesEndpoint = imagesEndpoint  + '/galleries';
		var galleryCoversEndpoint = imagesEndpoint  + '/gallerycovers';
	    var imagesPromise;
		var galleriesPromise;
		var galleryCoversPromise;

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
			getGalleries: function() {
				if(!galleriesPromise) {
					galleriesPromise = $http.get(galleriesEndpoint).then(function(response) {
						return response.data
					});
				} return galleriesPromise;
			},
			refreshGalleries: function() {
				galleriesPromise = $http.get(galleriesEndpoint).then(function(response) {
					return response.data
				});
				return galleriesPromise;
			},
			getGalleryWhere: function(queryParameters, callback) {
				$http.get(galleriesEndpoint + '?' + queryParameters).then(function(response) {
				    callback(response.data);
				});
			},
			getGalleryCovers: function() {
				if(!galleryCoversPromise) {
					galleryCoversPromise = $http.get(galleryCoversEndpoint).then(function(response) {
						return response.data
					});
				} return galleryCoversPromise;
			},
			refreshGalleryCovers: function() {
				galleryCoversPromise = $http.get(galleryCoversEndpoint).then(function(response) {
					return response.data
				});
				return galleryCoversPromise;
			}
	    };
	    return imagesService;
	
	}]);

});