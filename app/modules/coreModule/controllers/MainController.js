define(function() {

	var app = angular.module('coreModule');
	
	app.controller('MainController', function($scope,
											  $rootScope,
											  $http,
											  $sce,
                                              parallaxHelper,
											  DateService,
											  ContactpersonsService,
											  DescriptionService,
											  VenuesService,
											  GigsService,
											  ImagesService,
											  MembersService,
											  UsersService,
											  EmbeddeditemsService) {

		$scope.background = parallaxHelper.createAnimator(-0.3, 300, -250);
		$scope.foreground = parallaxHelper.createAnimator(-0.1, 150, -150);

		$scope.dateFormat = 'd/M, yyyy';
		$scope.timeFormat = 'HH:mm';

		$scope.email = "spoketikoket@gmail.com";

		DateService.getCurrentDatetime(function(currentDatetime) {
			$scope.currentDate = currentDatetime;
		});

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

		ImagesService.getGalleryCovers().then(function(galleryCovers) {
			$scope.galleryCovers = galleryCovers;
		});


	    MembersService.getMembers().then(function(members) {
	        $scope.members = members;
	    });
	    UsersService.getUsers().then(function(users) {
	        $scope.users = users;
	    });

	    EmbeddeditemsService.getVideos().then(function(videos) {
	        $scope.videos = videos;
	    });

		EmbeddeditemsService.getSounds().then(function(sounds) {
			$scope.sounds = sounds;
		});

	    $scope.trustUrl = function(src) {
	        return $sce.trustAsResourceUrl(src);
	    };

	});

});