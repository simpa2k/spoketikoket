define(function() {

    var app = angular.module('coreModule');

    app.controller('AdminGalleriesController', function($scope,
                                                        $rootScope,
                                                        $http,
                                                        $filter,
                                                        $uibModal,
                                                        SendObjectService,
                                                        ImagesService,
                                                        ValidationService,
                                                        fileUpload) {

        var imagesEndpoint = $rootScope.serverRoot + 'images';
        var galleriesEndpoint = imagesEndpoint + '/galleries';
        $scope.galleryToBeSent = {};
        $scope.imagesToBeSent = {};

        ImagesService.getGalleries().then(function(galleries) {

            // Converting an object of objects to array
            angular.forEach(galleries, function (value, key) {

                galleries[key] = $.map(value, function(pathsObject) {
                    return [pathsObject];
                });

            });
            $scope.galleries = galleries;
        });

        $scope.isSubmittedOrTouched = function(form, formControl) {

            return ValidationService.isSubmittedOrTouched(form, formControl);

        };

        $scope.isRequired = function(form, formControl) {

            return ValidationService.isRequired(form, formControl);

        };

        $scope.isRequiredAndSubmittedOrTouched = function(form, formControl) {

            return ValidationService.isRequiredAndSubmittedOrTouched(form, formControl);

        };

        $scope.hasError = function(form, formControl) {
            return $scope.isRequiredAndSubmittedOrTouched(form, formControl) ? 'has-error' : '';
        };

        $scope.resolveButtonGroup = function() {
            return $scope.addingNewGallery ? '' : 'btn-group';
        };

        $scope.editGallery = function(galleryName) {

            let selectedGallery = {
                galleryname: galleryName,
                images: $scope.galleries[galleryName]
            };

            $scope.galleryToBeSent = selectedGallery;

            $scope.heading = 'Redigera ' + galleryName;
            $scope.galleryAction = 'Bekräfta ändringar';
            $scope.addingNewGallery = false;
            $scope.sendGallery = $scope.putGallery;
        };

        $scope.setPostState = function(form) {
            $scope.galleryToBeSent = {};

            $scope.heading = 'Lägg till nytt galleri';
            $scope.galleryAction = 'Lägg till galleri';
            $scope.addingNewGallery = true;
            $scope.sendGallery= $scope.postGallery;

            if(typeof(form) != 'undefined') {
                ValidationService.resetForm(form);
            }
        };

        var refreshGalleries = function() {
            ImagesService.refreshGalleries().then(function(galleries) {
                $scope.galleries = galleries;
            });
        };

        var reloadSelectedGallery = function() {
            $scope.editGallery($scope.galleryToBeSent.galleryname);
        };

        $scope.refreshGalleriesWithReload = function() {
            ImagesService.refreshGalleries().then(function(galleries) {
                $scope.galleries = galleries;
                reloadSelectedGallery();
            });
        };

        $scope.deleteImage = function(image) {

            let modalInstance = $uibModal.open({
                templateUrl: '../../partials/delete-modal.html',
                controller: 'DeleteModalController'
            });

            modalInstance.result.then(function() {
                SendObjectService.deleteObject(imagesEndpoint, image, function() {
                    $scope.refreshGalleriesWithReload();
                });
            })

        };

        $scope.deleteTemporaryImage = function(galleryname, imageIndex) {
            $scope.imagesToBeSent[galleryname].splice(imageIndex, 1);
        };

        $scope.constructImageUploadUrl = function() {
            let galleryWithoutExistingImages = angular.copy($scope.galleryToBeSent);
            delete galleryWithoutExistingImages.images;

            return SendObjectService.createUri(imagesEndpoint, galleryWithoutExistingImages);
        };

        var refreshImages = function() {
            ImagesService.refreshImages().then(function(images){
                $scope.images = images;
            });
        };

        $scope.postGallery = function(form) {
            console.log($scope.imagesToBeSent);
            /*SendObjectService.postObject(galleriesEndpoint, $scope.imageToBeSent, function() {
                refreshImages();
                $scope.setPostState();
            });*/
        };

        $scope.putGallery = function() {
            console.log($scope.constructImageUploadUrl(), $scope.imagesToBeSent[$scope.galleryToBeSent.galleryname]);
            fileUpload.uploadFileToUrl($scope.imagesToBeSent[$scope.galleryToBeSent.galleryname],
                                        $scope.constructImageUploadUrl());
            /*SendObjectService.putObject(galleriesEndpoint, $scope.imageToBeSent, function() {
                refreshImages();
            });*/
        };

        $scope.deleteGallery = function() {
            SendObjectService.deleteObject(galleriesEndpoint, $scope.imageToBeSent, function() {
                refreshImages();
                $scope.setPostState();
            });
        };

        $scope.setPostState();

    });

});
