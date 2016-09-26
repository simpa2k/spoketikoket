define(function() {

   var app = angular.module('coreModule');

   app.controller('GalleryController', function($scope, $uibModalInstance) {

      $scope.closeModal = function() {
         $uibModalInstance.close();
      };

   });

});