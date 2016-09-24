define(function() {

   var app = angular.module('coreModule');

   app.controller('GalleryController', function($scope, $stateParams, ImagesService) {

      $scope.name = $stateParams.name;

      ImagesService.getGalleryWhere('galleryname=' + $scope.name, function(images) {
         $scope.images = images[$stateParams.name];

         $scope.selectedImage = {
            image: $scope.images[Object.keys($scope.images)[0]]
         };

      });

   });

});