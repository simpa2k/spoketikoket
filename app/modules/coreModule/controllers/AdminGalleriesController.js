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

        /*
         * To be used as a key into $scope.imagesToBeSent
         * for new galleries, the names of which
         * will change so much that something else is needed
         * to identify them.
         * The reason it's specified here is purely for
         * maintenance reasons as it can be easily changed.
         */                                                        
        var newGalleryKey = 'newGallery';                                                            

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
                images: $scope.galleries[galleryName].images,
                galleryCover: $scope.galleries[galleryName].galleryCover
            };

            $scope.galleryToBeSent = selectedGallery;

            /*
             * The fact that a separate ID variable is used
             * counteracts the problem of changing the galleries name.
             * The old name will still be used as the id, despite the fact that the
             * actual name being used might change. This also simplifies
             * the process of changing the galleries name, as the original
             * name of the gallery has to be provided to the server. In this way,
             * the original name is saved.
             */
            $scope.galleryToBeSentID = $scope.galleryToBeSent.galleryname;

            let newImages = $scope.imagesToBeSent.galleryToBeSentID;
            if(typeof(newImages) == 'undefined' || newImages == null || newImages.hasOwnProperty.length && length == 0) {
                $scope.imagesToBeSent[$scope.galleryToBeSentID] = [];
            }

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
            $scope.galleryToBeSentID = newGalleryKey;
            $scope.imagesToBeSent[$scope.galleryToBeSentID] = [];

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

            imageKey = $scope.addingNewGallery ? newGalleryKey : galleryname;
            $scope.imagesToBeSent[imageKey].splice(imageIndex, 1);

        };

        $scope.isGallerycover = function(image, galleryname) {

            let filename = image.full.substring(image.full.lastIndexOf('/') + 1);

            galleryCoverPath = $scope.galleryToBeSent.galleryCover;
            
            if(galleryCoverPath != null) {

                let galleryCoverFilename = galleryCoverPath.substring(galleryCoverPath.lastIndexOf('/') + 1);
                return filename == galleryCoverFilename;

            }

        };

        $scope.setGalleryCover = function(image) {

            $scope.galleryToBeSent.galleryCover = image.full;

        };

        var removeImagesFromObject = function(object)  {

            let objectWithoutExistingImages = angular.copy(object);
            delete objectWithoutExistingImages.images;

            return objectWithoutExistingImages;

        };

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

        var postImages = function(galleryID) {

            let filesToBeSent = extractImageFiles(galleryID);

            if(filesToBeSent.length > 0) {
                return fileUpload.uploadFileToUrl(filesToBeSent, $scope.constructImageUploadUrl());
            }
        };

        $scope.postGallery = function(form) {

           postImages(newGalleryKey)

                .success(function() {
                    refreshImages();

                    /*
                     * Splice is used here as only setting the array to [] will not
                     * affect references to the array, such as file-model using it as
                     * model. By using splice, every reference to the array will
                     * also be emptied, which prevents old images from showing up again
                     * after a gallery has been deleted, for example.
                     */
                    $scope.imagesToBeSent[$scope.galleryToBeSentID].splice(0, $scope.imagesToBeSent[$scope.galleryToBeSentID].length);
                    $scope.refreshGalleriesWithReload();

                    ValidationService.resetForm(form);

                })
                .error(function() {
                    // Handle error
                });

        };
		
        var handleUpdatedGalleryName = function(gallery) {
               
            let modifiedGallery = angular.copy(gallery);

            modifiedGallery.oldName = $scope.galleryToBeSentID;
            modifiedGallery.newName = gallery.galleryname;

            delete modifiedGallery.galleryname;

            return modifiedGallery;

        };

        $scope.putGallery = function(form) {

            let imagePost = postImages($scope.galleryToBeSent.galleryname);
            if(typeof(imagePost) != 'undefined') {

                imagePost

                .success(function() {

                    refreshImages();
                    refreshGalleries();
                    ValidationService.resetForm(form);

                })
                .error(function() {
                    // Handle error
                });

            }

            let galleryWithoutExistingImages = removeImagesFromObject($scope.galleryToBeSent);

            // If the gallery name has been changed.
            if($scope.galleryToBeSentID != galleryWithoutExistingImages.galleryname) {
                galleryWithoutExistingImages = handleUpdatedGalleryName(galleryWithoutExistingImages);
            }

            SendObjectService.putObject(galleriesEndpoint, galleryWithoutExistingImages, function() {

                refreshGalleries(); 
                ValidationService.resetForm(form);

            });

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

                    $scope.imagesToBeSent[$scope.galleryToBeSentID].splice(0, $scope.imagesToBeSent[$scope.galleryToBeSentID].length);
                    delete $scope.imagesToBeSent[$scope.galleryToBeSent.galleryname];

                    refreshGalleries();
                    ValidationService.resetForm(form);
                    $scope.setPostState();

                });
                
            });
        };

        $scope.setPostState();

    });

});
