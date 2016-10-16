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

            /*
             * The fact that a separate ID variable is used
             * counteracts the problem of changing the galleries name.
             * The old name will still be used as the id, despite the fact that the
             * actual name being used might change.
             */
            $scope.galleryToBeSentID = $scope.galleryToBeSent.galleryname;

            $scope.heading = 'Redigera ' + galleryName;
            $scope.galleryAction = 'Bekräfta ändringar';
            $scope.addingNewGallery = false;
            $scope.sendGallery = $scope.putGallery;
        };

        $scope.setPostState = function(form) {
            $scope.galleryToBeSent = {};

            /* 
             * Had the name of the new gallery been used,
             * a new key in $scope.imagesToBeSent had been generated each time the
             * name was updated, thus hiding all images
             * associated with the previous name. A fixed id for the 
             * new gallery counteracts this.
             */
            $scope.galleryToBeSentID = 'newGallery';

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
            let filesToBeSent = extractImageFiles($scope.galleryToBeSent.galleryname);
            let success = fileUpload.uploadFileToUrl(filesToBeSent, $scope.constructImageUploadUrl());

            if(success) {
                //Show confirmation
            } else {
                //Show error message
            }
            /*SendObjectService.postObject(galleriesEndpoint, $scope.imageToBeSent, function() {
                refreshImages();
                $scope.setPostState();
            });*/
        };
		
        var extractImageFiles = function(galleryName) {

            let imageFiles = [];

            angular.forEach($scope.imagesToBeSent[galleryName], function(value) {

                imageFiles.push(value.file);

            });

            return imageFiles;

        };

        $scope.putGallery = function() {

            let filesToBeSent = extractImageFiles($scope.galleryToBeSent.galleryname);
            let success = fileUpload.uploadFileToUrl(filesToBeSent, $scope.constructImageUploadUrl());

            if(success) {
                //Show confirmation
            } else {
                //Show error message
            }

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
