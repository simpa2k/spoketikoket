define(function() {

    var app = angular.module('coreModule');
    
    app.factory('ImagesService', ['$http', '$rootScope', function($http, $rootScope) {
    
        var imagesEndpoint = $rootScope.serverRoot + 'images';
        var galleriesEndpoint = imagesEndpoint  + '/galleries';
        var galleryCoversEndpoint = imagesEndpoint  + '/gallerycovers';
        var imagesPromise;
        var galleriesPromise;
        var galleryCoversPromise;

        var formatGalleryResponse = function(galleries) {

            angular.forEach(galleries, function(gallery) {

                let images = [];

                angular.forEach(gallery.images, function(imagePaths) {
                    images.push(imagePaths);
                });

                gallery.images = images;
            });

            return galleries;

        };

        var imagesService = {

            getImages: function() {

                if(!imagesPromise) {

                    imagesPromise = $http.get(imagesEndpoint).then(function(response) {
                        return response.data
                    });

                } 
                return imagesPromise;
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

                        galleries = formatGalleryResponse(response.data);
                        return galleries; 

                    });

                } 
                return galleriesPromise;
            },
            refreshGalleries: function() {

                galleriesPromise = $http.get(galleriesEndpoint).then(function(response) {

                    galleries = formatGalleryResponse(response.data);
                    return galleries; 

                });
                return galleriesPromise;
            },
            getGalleryWhere: function(queryParameters, callback) {

                $http.get(galleriesEndpoint + '?' + queryParameters).then(function(response) {

                    galleries = formatGalleryResponse(response.data);
                    callback(galleries);

                });

            },
            getGalleryCovers: function() {

                if(!galleryCoversPromise) {

                    galleryCoversPromise = $http.get(galleryCoversEndpoint).then(function(response) {
                        return response.data
                    });
                } 
                return galleryCoversPromise;
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
