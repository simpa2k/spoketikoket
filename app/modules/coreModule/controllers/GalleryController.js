define(function() {

   var app = angular.module('coreModule');

   app.controller('GalleryController', function($scope, $rootScope, $uibModalInstance, ImagesService) {

      $scope.closeModal = function() {
         $uibModalInstance.close();
      };

   });

});