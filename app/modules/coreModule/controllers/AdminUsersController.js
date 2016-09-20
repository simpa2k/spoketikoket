define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminUsersController', function($scope, $rootScope, $http, $filter, SendObjectService, UsersService) {
	
	    
	
	    $scope.userToBeSent = {};
	
	    
	
	    $scope.setPutState = function(user) {
	        $scope.userToBeSent.username = user.username;
	        $scope.userToBeSent.id = user.id;
	        $scope.userToBeSent.token = user.token;
	        $scope.userToBeSent.password = user.password;
	        $scope.sendUsers = $scope.putUsers;
	    };
	
	    $scope.setPostState = function() {
	        $scope.userToBeSent = {};
	        $scope.sendUsers = $scope.postUsers;
	    };
	
	    
	
	    var usersEndpoint = $rootScope.serverRoot + 'users';
	
	    var refreshUsers = function() {
	        UsersService.refreshUsers().then(function(users){
	            $scope.users = users;
	        });
	    };
	
	    $scope.postUsers = function() {
	        SendObjectService.postObject(usersEndpoint, $scope.userToBeSent, function() {
	            refreshUsers();
	            $scope.setPostState();
	        });
	    };
	
	    $scope.putUsers = function() {
	        SendObjectService.putObject(usersEndpoint, $scope.userToBeSent, function() {
	            refreshUsers();
	        });
	    };
	
	    $scope.deleteUsers = function() {
	        SendObjectService.deleteObject(usersEndpoint, $scope.userToBeSent, function() {
	            refreshUsers();
	            $scope.setPostState();
	        });
	    };
	
	    
	
	    $scope.setPostState();
	
	});

});