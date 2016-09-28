define(function() {

   var app = angular.module('coreModule');

   app.directive('gallery', function() {

      return {
         restrict: 'E',
         replace: true,
         scope: {
            name: '@',
            selectedImage: '=',
            images: '=',
            closeModal: '&'
         },
         templateUrl: 'partials/gallery.html',
         link: function($scope) {

            var modalDialog = $('.modal-window .modal-dialog');

            modalDialog.ready(function() {

               //modalDialog.addClass('image-not-selected');

            });

            var toggleModalSize = function() {

               /*if (modalDialog.hasClass('image-not-selected')) {

                  modalDialog.removeClass('image-not-selected');
                  modalDialog.addClass('image-selected');

               } else if (modalDialog.hasClass('image-selected')) {

                  modalDialog.removeClass('image-selected');
                  modalDialog.addClass('image-not-selected');

               }*/

            };

            $scope.selectImage = function(image) {
               $scope.selectedImage.image = image;
               modalDialog.addClass('image-selected');
            };


            $scope.back = function() {
               $scope.selectedImage.image = null;
               modalDialog.removeClass('image-selected');
            };

            $scope.close = function() {
               $scope.closeModal();
            };

         }
      }

   });

});