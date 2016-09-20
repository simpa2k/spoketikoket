define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminGigsController', function($scope, $rootScope, $http, $filter, SendObjectService, GigsService) {
	
	    var getVenue = function() {
	        $http.get($rootScope.serverRoot + 'venue').then(function(response) {
	            $scope.venue;
	            angular.forEach(response.data, function(value) {
	                $scope.venue[value.name] = value;
	            });
	        })
	    };
	
	    $scope.gigToBeSent = {};
	
	    var selectVenue = function(gig) {
	        angular.forEach($scope.Venue, function(value) {
	            if(value.name == name) {
	                $scope.selectedVenue = jQuery.extend({}, value);
	            }
	        });
	    };
	
	    $scope.setPutState = function(gig) {
	        $scope.gigToBeSent.datetime = gig.datetime;
	        $scope.gigToBeSent.price = gig.price;
	        $scope.gigToBeSent.ticketlink = gig.ticketlink;
	        $scope.gigToBeSent.id = gig.id;
	        $scope.gigToBeSent.venue_name = gig.venue_name;
	        $scope.gigToBeSent.info = gig.info;
	        selectVenue(gig.venue_name);
	        $scope.sendGigs = $scope.putGigs;
	    };
	
	    $scope.setPostState = function() {
	        $scope.gigToBeSent = {};
	        $scope.selectedVenue = undefined;
	        $scope.sendGigs = $scope.postGigs;
	    };
	
	    var sendVenue = function() {};
	
	    var gigsEndpoint = $rootScope.serverRoot + 'gigs';
	
	    var refreshGigs = function() {
	        GigsService.refreshGigs().then(function(gigs){
	            $scope.gigs = gigs;
	        });
	    };
	
	    $scope.postGigs = function() {
	        sendVenue();
	        SendObjectService.postObject(gigsEndpoint, $scope.gigToBeSent, function() {
	            refreshGigs();
	            $scope.setPostState();
	        });
	    };
	
	    $scope.putGigs = function() {
	        sendVenue();
	        SendObjectService.putObject(gigsEndpoint, $scope.gigToBeSent, function() {
	            refreshGigs();
	        });
	    };
	
	    $scope.deleteGigs = function() {
	        sendVenue();
	        SendObjectService.deleteObject(gigsEndpoint, $scope.gigToBeSent, function() {
	            refreshGigs();
	            $scope.setPostState();
	        });
	    };
	
	    getVenue();
	
	    $scope.setPostState();
	
	});

});