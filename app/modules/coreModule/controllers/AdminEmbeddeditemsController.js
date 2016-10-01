define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminEmbeddeditemsController', function($scope, $rootScope, $http, $filter, SendObjectService, EmbeddeditemsService, ValidationService) {

		var embeddeditemsEndpoint = $rootScope.serverRoot + 'embeddeditems';

		$scope.isSubmittedOrTouched = function(form, nestedFormControl, nestedForms = null) {

			return ValidationService.isSubmittedOrTouched(form, nestedFormControl, nestedForms);

		};

		$scope.isRequired = function(form, nestedFormControl, nestedForms = null) {

			return ValidationService.isRequired(form, nestedFormControl, nestedForms);

		};

		$scope.isRequiredAndSubmittedOrTouched = function(form, nestedFormControl, nestedForms) {

		    return ValidationService.isRequiredAndSubmittedOrTouched(form, nestedFormControl, nestedForms);

		};

		$scope.hasError = function(form, formControl, nestedForms) {
			return $scope.isRequiredAndSubmittedOrTouched(form, formControl, nestedForms) ? 'has-error' : '';
		};

		$scope.constructItemID = function(type, index, connector = '-') {
			return type + connector + index;
		};

		$scope.constructEditFormName = function(type, index) {
			return $scope.constructItemID(type, index, '') + 'EditForm';
		};

	    $scope.embeddeditemsToBeSent = {
	        newEmbeddeditem: {}
        };

		$scope.embeddeditemToBeSent = {};

	    var elementWithOpenEditingControls = null;

		var toggleEditingControls = function(element) {

			let editingControls = element.find('.editing-controls');
			let putStateButton= element.find('.put-state-button')

			if(editingControls.hasClass('ng-hide')) {

				editingControls.removeClass('ng-hide');
				putStateButton.addClass('ng-hide');

			} else {

				editingControls.addClass('ng-hide');
				putStateButton.removeClass('ng-hide');

			}

		};

	    var showControls = function(elementId) {

            if(elementWithOpenEditingControls != null) {
                toggleEditingControls(elementWithOpenEditingControls);
            }

            var element = $('#' + elementId);

            if(element.is(elementWithOpenEditingControls)) {
                elementWithOpenEditingControls = null;
            } else {

                elementWithOpenEditingControls = element;
                toggleEditingControls(element);

            }

		};

		$scope.hideControls = function() {

			if(elementWithOpenEditingControls != null) {

				toggleEditingControls(elementWithOpenEditingControls);
                elementWithOpenEditingControls = null;

			}

		};

	    $scope.setPutState = function(embeddeditem, index) {

            let uniqueId = embeddeditem.type + '-' + index;
            let objectCopy = $scope.embeddeditemsToBeSent[uniqueId];

            if(typeof(objectCopy) == 'undefined') {
                objectCopy = jQuery.extend({}, embeddeditem);
                delete objectCopy.$$hashKey;

                $scope.embeddeditemsToBeSent[uniqueId] = objectCopy;
            }

			$scope.embeddeditemToBeSent = objectCopy;

			showControls(uniqueId);

			$scope.embeddeditemAction = 'Bekräfta ändringar';
			$scope.heading = 'Redigera klipp';
            $scope.addingNewEmbeddeditem = false;

	        $scope.sendEmbeddeditem = $scope.putEmbeddeditem;
	    };
	
	    $scope.setPostState = function() {
	        $scope.embeddeditemToBeSent = {};
			$scope.embeddeditemsToBeSent = {
				newEmbeddeditem: {}
			};

			$scope.embeddeditemAction = 'Lägg till klipp';
			$scope.heading = 'Lägg till nytt klipp';
			$scope.addingNewEmbeddeditem = true;

	        $scope.sendEmbeddeditem = $scope.postEmbeddeditem;
	    };


	    var refreshEmbeddeditems = function() {
	        EmbeddeditemsService.refreshEmbeddeditems().then(function(embeddeditems){
	            $scope.embeddeditems = embeddeditems;
	        });

            EmbeddeditemsService.refreshVideos().then(function(videos) {
                $scope.videos = videos;
            });

            EmbeddeditemsService.refreshSounds().then(function(sounds) {
                $scope.sounds= sounds;
            });
	    };
	
	    $scope.postEmbeddeditem = function(form) {

	        $scope.embeddeditemToBeSent = $scope.embeddeditemsToBeSent['newEmbeddeditem'];

	        SendObjectService.postObject(embeddeditemsEndpoint, $scope.embeddeditemToBeSent, function() {
	            refreshEmbeddeditems();

				$scope.setPostState();
				ValidationService.resetForm(form);
	        });
	    };
	
	    $scope.putEmbeddeditem = function(form) {
	        SendObjectService.putObject(embeddeditemsEndpoint, $scope.embeddeditemToBeSent, function() {
	            refreshEmbeddeditems();
				ValidationService.resetForm(form);
	        });
	    };
	
	    $scope.deleteEmbeddeditem = function(form) {
	        SendObjectService.deleteObject(embeddeditemsEndpoint, $scope.embeddeditemToBeSent, function() {
	            refreshEmbeddeditems();
				ValidationService.resetForm(form);
	        });
	    };

	    $scope.setPostState();
	
	});

});