define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminEmbeddeditemsController', function($scope, $rootScope, $http, $filter, SendObjectService, EmbeddeditemsService) {

		var embeddeditemsEndpoint = $rootScope.serverRoot + 'embeddeditems';
	    $scope.embeddeditemsToBeSent = {};
		$scope.embeddeditemToBeSent = {};

	    var elementWithOpenEditingControls = null;

		var toggleEditingControls = function(editingControls) {

			if(editingControls.hasClass('ng-hide')) {

				editingControls.removeClass('ng-hide');

			} else {

				editingControls.addClass('ng-hide');

			}

		};

	    var showControls = function(elementId) {

	        if(elementWithOpenEditingControls != null) {
	        	elementWithOpenEditingControls.children('.editing-controls').addClass('ng-hide');
			}

	    	var element = $('#' + elementId);
			var elementEditingControls = element.children('.editing-controls');

			toggleEditingControls(elementEditingControls);

			elementWithOpenEditingControls = element;

		};

	    $scope.setPutState = function(embeddeditem, index) {

			$scope.embeddeditemsToBeSent[embeddeditem.type + '-' + index] = {
				id: embeddeditem.id,
				src: embeddeditem.src,
				type: embeddeditem.type
			};

	        $scope.embeddeditemToBeSent.id = embeddeditem.id;
	        $scope.embeddeditemToBeSent.src = embeddeditem.src;
			$scope.embeddeditemToBeSent.type = embeddeditem.type;

			console.log($scope.embeddeditemsToBeSent);
			console.log($scope.embeddeditemToBeSent);

			showControls(embeddeditem.type + '-' + index);

			$scope.embeddeditemAction = 'Bekräfta ändringar';
            $scope.editButtonText = 'Avsluta redigeringsläge';
			$scope.heading = 'Redigera klipp';
            $scope.addingNewEmbeddeditem = false;

	        $scope.sendEmbeddeditem = $scope.putEmbeddeditem;
	    };
	
	    $scope.setPostState = function() {
	        $scope.embeddeditemToBeSent = {};

			$scope.embeddeditemAction = 'Lägg till klipp';
			$scope.editButtonText = 'Redigera';
			$scope.heading = 'Lägg till nytt klipp';
			$scope.addingNewEmbeddeditem = true;

	        $scope.sendEmbeddeditem = $scope.postEmbeddeditem;
	    };


	    var refreshEmbeddeditems = function() {
	        EmbeddeditemsService.refreshEmbeddeditems().then(function(embeddeditems){
	            $scope.embeddeditems = embeddeditems;
	        });
	    };
	
	    $scope.postEmbeddeditem = function() {
	        SendObjectService.postObject(embeddeditemsEndpoint, $scope.embeddeditemToBeSent, function() {
	            refreshEmbeddeditems();
	            $scope.setPostState();
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
	            $scope.setPostState();
	        });
	    };

	    $scope.setPostState();
	
	});

});