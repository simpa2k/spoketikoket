define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminGalleriesController', function($scope, $rootScope, $http, $filter, SendObjectService, ImagesService, ValidationService) {

		var imagesEndpoint = $rootScope.serverRoot + 'images';
		var galleriesEndpoint = imagesEndpoint + '/galleries';
	    $scope.galleryToBeSent = {};

	    ImagesService.getGalleries().then(function(galleries) {
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
				images: angular.copy($scope.galleries[galleryName])
			};

	        console.log(selectedGallery);
			$scope.galleryToBeSent = selectedGallery;

			$scope.heading = 'Redigera ' + galleryName;
			$scope.galleryAction = 'Bekräfta ändringar';
			$scope.addingNewGallery = false;
	        $scope.sendGallery = $scope.putGallery;
	    };
	
	    $scope.setPostState = function() {
	        $scope.galleryToBeSent = {};

	        $scope.heading = 'Lägg till nytt galleri';
			$scope.galleryAction = 'Lägg till galleri';
			$scope.addingNewGallery = true;
	        $scope.sendGallery= $scope.postGallery;
	    };

		$scope.deleteImage = function(image) {

		    /*SendObjectService.deleteObject(imagesEndpoint, image, function() {
		    	refreshImages();
			});*/

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
	
	    $scope.postGallery = function() {
	        SendObjectService.postObject(galleriesEndpoint, $scope.imageToBeSent, function() {
	            refreshImages();
	            $scope.setPostState();
	        });
	    };
	
	    $scope.putGallery = function() {
	        SendObjectService.putObject(galleriesEndpoint, $scope.imageToBeSent, function() {
	            refreshImages();
	        });
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