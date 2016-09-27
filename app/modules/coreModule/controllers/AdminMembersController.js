define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminMembersController', function($scope, $rootScope, $http, $filter, SendObjectService, MembersService) {
	
	    $scope.memberToBeSent = {};
		var membersEndpoint = $rootScope.serverRoot + 'members';

	    $scope.setPutState = function(member) {

			$scope.memberToBeSent.id = member.id;
	        $scope.memberToBeSent.lastname = member.lastname;
	        $scope.memberToBeSent.firstname = member.firstname;
	        $scope.memberToBeSent.instrument = member.instrument;

			$scope.heading = "Redigera medlem";
			$scope.memberAction = 'Bekräfta ändringar';
			$scope.addingNewMember = false;

	        $scope.sendMember = $scope.putMember;
			console.log($scope.memberToBeSent);
	    };
	
	    $scope.setPostState = function() {
	        $scope.memberToBeSent = {};

			$scope.heading = "Lägg till ny medlem";
			$scope.memberAction = 'Lägg till medlem';
            $scope.addingNewMember = true;

	        $scope.sendMember = $scope.postMember;
	    };

	    var refreshMembers = function() {
	        MembersService.refreshMembers().then(function(members){
	            $scope.members = members;
	        });
	    };
	
	    $scope.postMember = function() {
	        SendObjectService.postObject(membersEndpoint, $scope.memberToBeSent, function() {
	            refreshMembers();
	            $scope.setPostState();
	        });
	    };
	
	    $scope.putMember = function() {
	        SendObjectService.putObject(membersEndpoint, $scope.memberToBeSent, function() {
	            refreshMembers();
	        });
	    };
	
	    $scope.deleteMember = function() {
	        SendObjectService.deleteObject(membersEndpoint, $scope.memberToBeSent, function() {
	            refreshMembers();
	            $scope.setPostState();
	        });
	    };

	    $scope.setPostState();
	
	});

});