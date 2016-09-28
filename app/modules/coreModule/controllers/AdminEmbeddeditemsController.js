define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminEmbeddeditemsController', function($scope, $rootScope, $http, $filter, SendObjectService, EmbeddeditemsService) {

		var embeddeditemsEndpoint = $rootScope.serverRoot + 'embeddeditems';

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

			console.log($scope.embeddeditemsToBeSent);
			console.log($scope.embeddeditemToBeSent);

			showControls(uniqueId);

			$scope.embeddeditemAction = 'Bekräfta ändringar';
			$scope.heading = 'Redigera klipp';
            $scope.addingNewEmbeddeditem = false;

	        $scope.sendEmbeddeditem = $scope.putEmbeddeditem;
	    };
	
	    $scope.setPostState = function() {
	        $scope.embeddeditemToBeSent = {};

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
	
	    $scope.postEmbeddeditem = function() {

	        $scope.embeddeditemToBeSent = $scope.embeddeditemsToBeSent['newEmbeddeditem'];

	        SendObjectService.postObject(embeddeditemsEndpoint, $scope.embeddeditemToBeSent, function() {
	            refreshEmbeddeditems();
	            //$scope.setPostState();
	        });
	    };
	
	    $scope.putEmbeddeditem = function() {
	        SendObjectService.putObject(embeddeditemsEndpoint, $scope.embeddeditemToBeSent, function() {
	            refreshEmbeddeditems();
	        });
	    };
	
	    $scope.deleteEmbeddeditem = function() {
	        SendObjectService.deleteObject(embeddeditemsEndpoint, $scope.embeddeditemToBeSent, function() {
	            refreshEmbeddeditems();
	            //$scope.setPostState();
	        });
	    };

	    $scope.setPostState();
	
	});

});