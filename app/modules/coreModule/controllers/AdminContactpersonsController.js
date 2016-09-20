define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminContactpersonsController', function($scope, $rootScope, $http, $filter, SendObjectService, ContactpersonsService) {
	
	    
	
	    $scope.contactpersonToBeSent = {};
	
	    
	
	    $scope.setPutState = function(contactperson) {
	        $scope.contactpersonToBeSent.phonenumber = contactperson.phonenumber;
	        $scope.contactpersonToBeSent.name = contactperson.name;
	        $scope.sendContactpersons = $scope.putContactpersons;
	    };
	
	    $scope.setPostState = function() {
	        $scope.contactpersonToBeSent = {};
	        $scope.sendContactpersons = $scope.postContactpersons;
	    };
	
	    
	
	    var contactpersonsEndpoint = $rootScope.serverRoot + 'contactpersons';
	
	    var refreshContactpersons = function() {
	        ContactpersonsService.refreshContactpersons().then(function(contactpersons){
	            $scope.contactpersons = contactpersons;
	        });
	    };
	
	    $scope.postContactpersons = function() {
	        SendObjectService.postObject(contactpersonsEndpoint, $scope.contactpersonToBeSent, function() {
	            refreshContactpersons();
	            $scope.setPostState();
	        });
	    };
	
	    $scope.putContactpersons = function() {
	        SendObjectService.putObject(contactpersonsEndpoint, $scope.contactpersonToBeSent, function() {
	            refreshContactpersons();
	        });
	    };
	
	    $scope.deleteContactpersons = function() {
	        SendObjectService.deleteObject(contactpersonsEndpoint, $scope.contactpersonToBeSent, function() {
	            refreshContactpersons();
	            $scope.setPostState();
	        });
	    };
	
	    
	
	    $scope.setPostState();
	
	});

});