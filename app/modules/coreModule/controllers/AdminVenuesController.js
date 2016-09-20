define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminVenuesController', function($scope, $rootScope, $http, $filter, SendObjectService, VenuesService) {
	
	    
	
	    $scope.venueToBeSent = {};
	
	    
	
	    $scope.setPutState = function(venue) {
	        $scope.venueToBeSent.name = venue.name;
	        $scope.venueToBeSent.address = venue.address;
	        $scope.venueToBeSent.webpage = venue.webpage;
	        $scope.venueToBeSent.city = venue.city;
	        $scope.sendVenues = $scope.putVenues;
	    };
	
	    $scope.setPostState = function() {
	        $scope.venueToBeSent = {};
	        $scope.sendVenues = $scope.postVenues;
	    };
	
	    
	
	    var venuesEndpoint = $rootScope.serverRoot + 'venues';
	
	    var refreshVenues = function() {
	        VenuesService.refreshVenues().then(function(venues){
	            $scope.venues = venues;
	        });
	    };
	
	    $scope.postVenues = function() {
	        SendObjectService.postObject(venuesEndpoint, $scope.venueToBeSent, function() {
	            refreshVenues();
	            $scope.setPostState();
	        });
	    };
	
	    $scope.putVenues = function() {
	        SendObjectService.putObject(venuesEndpoint, $scope.venueToBeSent, function() {
	            refreshVenues();
	        });
	    };
	
	    
	
	    
	
	    $scope.setPostState();
	
	});

});