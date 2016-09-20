define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminMembersController', function($scope, $rootScope, $http, $filter, SendObjectService, MembersService) {
	
	    
	
	    $scope.memberToBeSent = {};
	
	    
	
	    $scope.setPutState = function(member) {
	        $scope.memberToBeSent.lastname = member.lastname;
	        $scope.memberToBeSent.firstname = member.firstname;
	        $scope.memberToBeSent.instrument = member.instrument;
	        $scope.sendMembers = $scope.putMembers;
	    };
	
	    $scope.setPostState = function() {
	        $scope.memberToBeSent = {};
	        $scope.sendMembers = $scope.postMembers;
	    };
	
	    
	
	    var membersEndpoint = $rootScope.serverRoot + 'members';
	
	    var refreshMembers = function() {
	        MembersService.refreshMembers().then(function(members){
	            $scope.members = members;
	        });
	    };
	
	    $scope.postMembers = function() {
	        SendObjectService.postObject(membersEndpoint, $scope.memberToBeSent, function() {
	            refreshMembers();
	            $scope.setPostState();
	        });
	    };
	
	    $scope.putMembers = function() {
	        SendObjectService.putObject(membersEndpoint, $scope.memberToBeSent, function() {
	            refreshMembers();
	        });
	    };
	
	    $scope.deleteMembers = function() {
	        SendObjectService.deleteObject(membersEndpoint, $scope.memberToBeSent, function() {
	            refreshMembers();
	            $scope.setPostState();
	        });
	    };
	
	    
	
	    $scope.setPostState();
	
	});

});