define(function() {

   var app = angular.module('coreModule');

   app.directive('gallery', function() {

      return {
         restrict: 'E',
         replace: true,
         scope: {
            name: '@',
            selectedImage: '=',
            images: '='
         },
         templateUrl: 'partials/gallery.html',
         link: function($scope) {

            $scope.selectImage = function(image) {
               $scope.selectedImage.image = image;
            }

         }
      }

   });

});