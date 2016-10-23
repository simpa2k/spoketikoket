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
        $scope.fileModel = {
            file: {}
        };

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
             * actual name being used might change.
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

                ImagesService.refreshGalleryCovers().then(function(galleryCovers) {

                    $scope.galleryCovers = galleryCovers;
                    reloadSelectedGallery();

                });

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
            console.log($scope.galleryToBeSent);

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

        $scope.postGallery = function(form) {

            let filesToBeSent = extractImageFiles(newGalleryKey);

            fileUpload.uploadFileToUrl(filesToBeSent, $scope.constructImageUploadUrl())

                .success(function() {

                    refreshImages();

                    $scope.imagesToBeSent = {};
                    $scope.refreshGalleriesWithReload();

                    ValidationService.resetForm(form);
                    
                })
                .error(function() {
                    
                });

        };
		
        $scope.putGallery = function() {

            let filesToBeSent = extractImageFiles($scope.galleryToBeSent.galleryname);

            fileUpload.uploadFileToUrl(filesToBeSent, $scope.constructImageUploadUrl())

                .success(function() {

                    refreshImages();
                    refreshGalleries();

                })
                .error(function() {

                });

            let galleryWithoutExistingImages = removeImagesFromObject($scope.galleryToBeSent);

            console.log(galleryWithoutExistingImages);
            SendObjectService.putObject(galleriesEndpoint, galleryWithoutExistingImages, function() {
                refreshGalleries(); 
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
                    refreshGalleries();
                    $scope.setPostState();
                });
                
            });
        };

        ImagesService.getGalleries().then(function(galleries) {

            // Converting an object of objects to array
            /*angular.forEach(galleries, function (value, key) {

                galleries[key] = $.map(value, function(pathsObject) {
                    return [pathsObject];
                });

            });*/
            angular.forEach(galleries, function(gallery) {

                let images = [];

                angular.forEach(gallery.images, function(imagePaths) {
                    images.push(imagePaths);
                });

                gallery.images = images;
            });

            $scope.galleries = galleries;
        });

        $scope.setPostState();

    });

});
