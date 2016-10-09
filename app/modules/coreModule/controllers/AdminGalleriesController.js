define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminGalleriesController', function($scope, $rootScope, $http, $filter, SendObjectService, ImagesService, ValidationService) {

		var galleriesEndpoint = $rootScope.serverRoot + 'images/galleries';
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

	    $scope.setPutState = function(galleryName) {
	        /*$scope.imageToBeSent.imagepath = image.imagepath;
	        $scope.imageToBeSent.thumbnailpath = image.thumbnailpath;*/
	        console.log($scope.galleries[galleryName]);
			$scope.galleryToBeSent = $scope.galleries[galleryName];

			$scope.heading = 'Redigera ' + galleryName;
	        $scope.sendImages = $scope.putImages;
	    };
	
	    $scope.setPostState = function() {
	        $scope.imageToBeSent = {};

	        $scope.heading = 'Lägg till nytt galleri';
	        $scope.sendImages = $scope.postImages;
	    };


	    var refreshImages = function() {
	        ImagesService.refreshImages().then(function(images){
	            $scope.images = images;
	        });
	    };
	
	    $scope.postImages = function() {
	        SendObjectService.postObject(galleriesEndpoint, $scope.imageToBeSent, function() {
	            refreshImages();
	            $scope.setPostState();
	        });
	    };
	
	    $scope.putImages = function() {
	        SendObjectService.putObject(galleriesEndpoint, $scope.imageToBeSent, function() {
	            refreshImages();
	        });
	    };
	
	    $scope.deleteImages = function() {
	        SendObjectService.deleteObject(galleriesEndpoint, $scope.imageToBeSent, function() {
	            refreshImages();
	            $scope.setPostState();
	        });
	    };

	    $scope.setPostState();
	
	});

});