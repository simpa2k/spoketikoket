define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminDescriptionController', function($scope, $rootScope, $http, $filter, SendObjectService, DescriptionService) {
	
	    
	
	    $scope.descriptionToBeSent = {};
	
	    
	
	    $scope.setPutState = function(description) {
	        $scope.descriptionToBeSent.id = description.id;
	        $scope.descriptionToBeSent.content = description.content;
	        $scope.sendDescription = $scope.putDescription;
	    };
	
	    $scope.setPostState = function() {
	        $scope.descriptionToBeSent = {};
	        $scope.sendDescription = $scope.postDescription;
	    };
	
	    
	
	    var descriptionEndpoint = $rootScope.serverRoot + 'description';
	
	    var refreshDescription = function() {
	        DescriptionService.refreshDescription().then(function(description){
	            $scope.description = description;
	        });
	    };
	
	    
	
	    $scope.putDescription = function() {
	        SendObjectService.putObject(descriptionEndpoint, $scope.descriptionToBeSent, function() {
	            refreshDescription();
	        });
	    };
	
	    
	
	    
	
	    $scope.setPostState();
	
	});

});