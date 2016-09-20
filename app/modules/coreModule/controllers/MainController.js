define(function() {

	var app = angular.module('coreModule');
	
	app.controller('MainController', function($scope,
											  $rootScope,
											  $http,
											  $sce,
                                              parallaxHelper,
											  ContactpersonsService,
											  DescriptionService,
											  VenuesService,
											  GigsService,
											  ImagesService,
											  MembersService,
											  UsersService,
											  EmbeddeditemsService) {

		$scope.background = parallaxHelper.createAnimator(-0.3, 300, -250);

		$scope.dateFormat = 'd/M, yyyy';
		$scope.timeFormat = 'HH:mm';

		$scope.email = "spoketikoket@gmail.com";

	    ContactpersonsService.getContactpersons().then(function(contactpersons) {
	        $scope.contactpersons = contactpersons;
	    });
	    DescriptionService.getDescription().then(function(description) {
	        $scope.description = description;
	    });
	    VenuesService.getVenues().then(function(venues) {
	        $scope.venues = venues;
	    });
	    GigsService.getGigs().then(function(gigs) {
	        $scope.gigs = gigs;
	    });
		ImagesService.getImages().then(function(images) {
			$scope.images = images;
		});
	    MembersService.getMembers().then(function(members) {
	        $scope.members = members;
	    });
	    UsersService.getUsers().then(function(users) {
	        $scope.users = users;
	    });
	    EmbeddeditemsService.getEmbeddeditems().then(function(embeddeditems) {
	        $scope.embeddeditems = embeddeditems;
	    });
	
	    $scope.trustUrl = function(src) {
	        return $sce.trustAsResourceUrl(src);
	    };
	
	});

});