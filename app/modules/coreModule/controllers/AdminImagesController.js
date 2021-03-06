define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminImagesController', function($scope, $rootScope, $http, $filter, SendObjectService, ImagesService, ValidationService) {

		var imagesEndpoint = $rootScope.serverRoot + 'images';
	    $scope.imageToBeSent = {};

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

	    $scope.setPutState = function(image) {
	        $scope.imageToBeSent.imagepath = image.imagepath;
	        $scope.imageToBeSent.thumbnailpath = image.thumbnailpath;
	        $scope.sendImages = $scope.putImages;
	    };
	
	    $scope.setPostState = function() {
	        $scope.imageToBeSent = {};
	        $scope.sendImages = $scope.postImages;
	    };


	    var refreshImages = function() {
	        ImagesService.refreshImages().then(function(images){
	            $scope.images = images;
	        });
	    };
	
	    $scope.postImages = function() {
	        SendObjectService.postObject(imagesEndpoint, $scope.imageToBeSent, function() {
	            refreshImages();
	            $scope.setPostState();
	        });
	    };
	
	    $scope.putImages = function() {
	        SendObjectService.putObject(imagesEndpoint, $scope.imageToBeSent, function() {
	            refreshImages();
	        });
	    };
	
	    $scope.deleteImages = function() {
	        SendObjectService.deleteObject(imagesEndpoint, $scope.imageToBeSent, function() {
	            refreshImages();
	            $scope.setPostState();
	        });
	    };

	    $scope.setPostState();
	
	});

});