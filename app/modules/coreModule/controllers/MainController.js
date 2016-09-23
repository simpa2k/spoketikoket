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
		$scope.foreground = parallaxHelper.createAnimator(-0.1, 150, -150);

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
        console.log($scope.images);

		ImagesService.getAlbums().then(function(albums) {
			$scope.albums = albums;
		});

		ImagesService.getAlbumCovers().then(function(albumCovers) {
			$scope.albumCovers = albumCovers;
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