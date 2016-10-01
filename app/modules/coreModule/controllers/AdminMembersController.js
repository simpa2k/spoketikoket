define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminMembersController', function($scope, $rootScope, $http, $filter, SendObjectService, MembersService, ValidationService) {

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

	    $scope.postMember = function(form) {
	        SendObjectService.postObject(membersEndpoint, $scope.memberToBeSent, function() {
	            refreshMembers();
	            $scope.setPostState();

				ValidationService.resetForm(form);
	        });
	    };
	
	    $scope.putMember = function(form) {
	        SendObjectService.putObject(membersEndpoint, $scope.memberToBeSent, function() {
	            refreshMembers();
				ValidationService.resetForm(form);
	        });
	    };
	
	    $scope.deleteMember = function(form) {
	        SendObjectService.deleteObject(membersEndpoint, $scope.memberToBeSent, function() {
	            refreshMembers();
	            $scope.setPostState();

				ValidationService.resetForm(form);
	        });
	    };

	    $scope.setPostState();
	
	});

});