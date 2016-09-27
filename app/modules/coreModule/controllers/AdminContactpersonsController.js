define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminContactpersonsController', function($scope, $rootScope, $http, $filter, SendObjectService, ContactpersonsService) {

		var contactpersonsEndpoint = $rootScope.serverRoot + 'contactpersons';
	    $scope.contactpersonToBeSent = {};

	    $scope.setPutState = function(contactperson) {
			$scope.contactpersonToBeSent.id = contactperson.id;
	        $scope.contactpersonToBeSent.phonenumber = contactperson.phonenumber;
	        $scope.contactpersonToBeSent.name = contactperson.name;
	        $scope.contactpersonToBeSent.country = contactperson.country;

            $scope.heading = 'Redigera kontaktperson';
			$scope.contactpersonAction = 'Bekräfta ändringar';
			$scope.addingNewContactperson = false;

	        $scope.sendContactperson = $scope.putContactperson;
	    };
	
	    $scope.setPostState = function() {
	        $scope.contactpersonToBeSent = {};

			$scope.heading = 'Lägg till ny kontaktperson';
			$scope.contactpersonAction = 'Lägg till kontaktperson';
			$scope.addingNewContactperson = true;

	        $scope.sendContactperson = $scope.postContactperson;
	    };

	    var refreshContactpersons = function() {
	        ContactpersonsService.refreshContactpersons().then(function(contactpersons){
	            $scope.contactpersons = contactpersons;
	        });
	    };
	
	    $scope.postContactperson = function() {
	        SendObjectService.postObject(contactpersonsEndpoint, $scope.contactpersonToBeSent, function() {
	            refreshContactpersons();
	            $scope.setPostState();
	        });
	    };
	
	    $scope.putContactperson = function() {
	        SendObjectService.putObject(contactpersonsEndpoint, $scope.contactpersonToBeSent, function() {
	            refreshContactpersons();
	        });
	    };
	
	    $scope.deleteContactperson = function() {
	        SendObjectService.deleteObject(contactpersonsEndpoint, $scope.contactpersonToBeSent, function() {
	            refreshContactpersons();
	            $scope.setPostState();
	        });
	    };

	    $scope.setPostState();
	
	});

});