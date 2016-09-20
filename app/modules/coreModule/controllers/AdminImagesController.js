define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminImagesController', function($scope, $rootScope, $http, $filter, SendObjectService, ImagesService) {
	
	    
	
	    $scope.imageToBeSent = {};
	
	    
	
	    $scope.setPutState = function(image) {
	        $scope.imageToBeSent.imagepath = image.imagepath;
	        $scope.imageToBeSent.thumbnailpath = image.thumbnailpath;
	        $scope.sendImages = $scope.putImages;
	    };
	
	    $scope.setPostState = function() {
	        $scope.imageToBeSent = {};
	        $scope.sendImages = $scope.postImages;
	    };
	
	    
	
	    var imagesEndpoint = $rootScope.serverRoot + 'images';
	
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