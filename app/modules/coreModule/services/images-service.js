define(function() {

    var app = angular.module('coreModule');
    
    app.factory('ImagesService', ['$http', '$rootScope', function($http, $rootScope) {
    
        var imagesEndpoint = $rootScope.serverRoot + 'images';
        var galleriesEndpoint = imagesEndpoint  + '/galleries';

        var imagesPromise;
        var galleriesPromise;

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
            }
        };

        return imagesService;
    
    }]);

});
