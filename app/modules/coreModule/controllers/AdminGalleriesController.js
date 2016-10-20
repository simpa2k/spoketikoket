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

        $scope.isSubmittedOrTouched = ValidationService.isSubmittedOrTouched;
        $scope.isRequired = ValidationService.isRequired;                                                            
        $scope.isRequiredAndSubmittedOrTouched = ValidationService.isRequiredAndSubmittedOrTouched;                                                            

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

        var refreshImages = function() {
            ImagesService.refreshImages().then(function(images){
                $scope.images = images;
            });
        };

        var refreshGalleries = function() {

            ImagesService.refreshGalleries().then(function(galleries) {
                $scope.galleries = galleries;

                ImagesService.refreshGalleryCovers().then(function(galleryCovers) {
                    $scope.galleryCovers = galleryCovers;
                });

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

        var openDeleteModal = function(callback) {

            let modalInstance = $uibModal.open({
                templateUrl: '../../partials/delete-modal.html',
                controller: 'DeleteModalController'
            });

            modalInstance.result.then(function() {
                callback();
            });
            
        };

        $scope.deleteImage = function(image) {

            openDeleteModal(function() {
                SendObjectService.deleteObject(imagesEndpoint, image, function() {
                    $scope.refreshGalleriesWithReload();
                });
            });

        };

        $scope.deleteTemporaryImage = function(galleryname, imageIndex) {
            $scope.imagesToBeSent[galleryname].splice(imageIndex, 1);
        };

        var removeImagesFromObject = function(object)  {

            let objectWithoutExistingImages = angular.copy(object);
            delete objectWithoutExistingImages.images;

            return objectWithoutExistingImages;

        }

        $scope.constructImageUploadUrl = function() {

            let galleryWithoutExistingImages = removeImagesFromObject($scope.galleryToBeSent);

            return SendObjectService.createUri(imagesEndpoint, galleryWithoutExistingImages);
        };

        var extractImageFiles = function(galleryName) {

            let imageFiles = [];

            angular.forEach($scope.imagesToBeSent[galleryName], function(value) {

                imageFiles.push(value.file);

            });

            return imageFiles;

        };

        $scope.postGallery = function(form) {

            let filesToBeSent = extractImageFiles('newGallery');
            let success = fileUpload.uploadFileToUrl(filesToBeSent, $scope.constructImageUploadUrl());

            refreshImages();
            refreshGalleries();

            $scope.imagesToBeSent = {};
            $scope.refreshGalleriesWithReload();

            ValidationService.resetForm(form);

            if(success) {
                //Show confirmation
            } else {
                //Show error message
            }

        };
		
        $scope.putGallery = function() {

            let filesToBeSent = extractImageFiles($scope.galleryToBeSent.galleryname);
            let success = fileUpload.uploadFileToUrl(filesToBeSent, $scope.constructImageUploadUrl());

            refreshImages();
            refreshGalleries();

            if(success) {
                //Show confirmation
            } else {
                //Show error message
            }

        };

        $scope.deleteGallery = function(form) {

            /*
             * ToDo: make sure there is much more information
             * presented when deleting a gallery, such as a list
             * of all images that will be permanently deleted.
             */

            openDeleteModal(function() {

                let galleryWithoutExistingImages = removeImagesFromObject($scope.galleryToBeSent);

                SendObjectService.deleteObject(galleriesEndpoint, galleryWithoutExistingImages, function() {
                    refreshGalleries();
                    $scope.setPostState();
                });
                
            });
        };

        ImagesService.getGalleries().then(function(galleries) {

            // Converting an object of objects to array
            angular.forEach(galleries, function (value, key) {

                galleries[key] = $.map(value, function(pathsObject) {
                    return [pathsObject];
                });

            });
            $scope.galleries = galleries;
        });

        $scope.setPostState();

    });

});
