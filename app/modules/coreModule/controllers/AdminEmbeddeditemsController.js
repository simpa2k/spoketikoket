define(function() {

	var app = angular.module('coreModule');
	
	app.controller('AdminEmbeddeditemsController', function($scope, $rootScope, $http, $filter, SendObjectService, EmbeddeditemsService) {
	
	    
	
	    $scope.embeddeditemToBeSent = {};
	
	    
	
	    $scope.setPutState = function(embeddeditem) {
	        $scope.embeddeditemToBeSent.id = embeddeditem.id;
	        $scope.embeddeditemToBeSent.src = embeddeditem.src;
	        $scope.sendEmbeddeditems = $scope.putEmbeddeditems;
	    };
	
	    $scope.setPostState = function() {
	        $scope.embeddeditemToBeSent = {};
	        $scope.sendEmbeddeditems = $scope.postEmbeddeditems;
	    };
	
	    
	
	    var embeddeditemsEndpoint = $rootScope.serverRoot + 'embeddeditems';
	
	    var refreshEmbeddeditems = function() {
	        EmbeddeditemsService.refreshEmbeddeditems().then(function(embeddeditems){
	            $scope.embeddeditems = embeddeditems;
	        });
	    };
	
	    $scope.postEmbeddeditems = function() {
	        SendObjectService.postObject(embeddeditemsEndpoint, $scope.embeddeditemToBeSent, function() {
	            refreshEmbeddeditems();
	            $scope.setPostState();
	        });
	    };
	
	    $scope.putEmbeddeditems = function() {
	        SendObjectService.putObject(embeddeditemsEndpoint, $scope.embeddeditemToBeSent, function() {
	            refreshEmbeddeditems();
	        });
	    };
	
	    $scope.deleteEmbeddeditems = function() {
	        SendObjectService.deleteObject(embeddeditemsEndpoint, $scope.embeddeditemToBeSent, function() {
	            refreshEmbeddeditems();
	            $scope.setPostState();
	        });
	    };
	
	    
	
	    $scope.setPostState();
	
	});

});