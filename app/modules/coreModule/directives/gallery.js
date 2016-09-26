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

               modalDialog.addClass('image-not-selected');

            });

            var toggleModalSize = function() {

               if (modalDialog.hasClass('image-not-selected')) {

                  modalDialog.removeClass('image-not-selected');
                  modalDialog.addClass('image-selected');

               } else if (modalDialog.hasClass('image-selected')) {

                  modalDialog.removeClass('image-selected');
                  modalDialog.addClass('image-not-selected');

               }

            };

            $scope.selectImage = function(image) {
               $scope.selectedImage.image = image;
               toggleModalSize();
            };


            $scope.back = function() {
               $scope.selectedImage.image = null;
               toggleModalSize();
            };

            $scope.close = function() {
               $scope.closeModal();
            };

            /*var setElementHeight = function(changingElement, model) {

               changingElement.css('height', model.height());

            };

            var selectedImage = $('#selected-image');
            var selectableContainer = $('#gallery-container .selectable-container');*/

            /*selectedImage.on('load', function() {

               $timeout(function() {

                  /*
                   On screens less than 768px in width the selectedImage is not
                   displayed. See gallery.less.

                  if($(window).width() >= 768) {
                     setElementHeight(selectableContainer, selectedImage);
                  }

              });

            });

            $(window).on('resize', function() {

               /*
                On screens less than 768px in width the selectedImage is not
                displayed. See gallery.less.


               if($(window).width() >= 768) {
                  setElementHeight(selectableContainer, selectedImage);
               }

            });*/
         }
      }

   });

});