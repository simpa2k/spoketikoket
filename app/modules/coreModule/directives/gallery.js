define(function() {

   var app = angular.module('coreModule');

   app.directive('gallery', function($timeout) {

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
            };

            var setElementHeight = function(changingElement, model) {

               changingElement.css('height', model.height());

            };

            var selectedImage = $('#selected-image');
            var selectableContainer = $('#gallery-container .selectable-container');

            selectedImage.on('load', function() {

               $timeout(function() {

                  /*
                   On screens less than 768px in width the selectedImage is not
                   displayed. See gallery.less.
                   */
                  if($(window).width() >= 768) {
                     setElementHeight(selectableContainer, selectedImage);
                  }

              });

            });

            $(window).on('resize', function() {

               /*
                On screens less than 768px in width the selectedImage is not
                displayed. See gallery.less.
                */

               if($(window).width() >= 768) {
                  setElementHeight(selectableContainer, selectedImage);
               }

            });
         }
      }

   });

});