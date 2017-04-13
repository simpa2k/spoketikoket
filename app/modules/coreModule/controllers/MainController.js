define(function() {

    var app = angular.module('coreModule');
    
    app.controller('MainController', function($scope,
                                              $rootScope,
                                              $http,
                                              $sce,
                                              $uibModal,
                                              parallaxHelper,
                                              DateService,
                                              ContactpersonsService,
                                              DescriptionService,
                                              VenuesService,
                                              GigsService,
                                              ImagesService,
                                              MembersService,
                                              UsersService,
                                              EmbeddeditemsService,
                                              AnnouncementsService) {

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

        ImagesService.getGalleries().then(function(galleries) {
            $scope.galleries = galleries;
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

        AnnouncementsService.getAnnouncements().then(function(announcements) {
            $scope.announcements = announcements;
        });

        $scope.trustUrl = function(src) {
            return $sce.trustAsResourceUrl(src);
        };

        $scope.openGallery = function(galleryName) {

            $scope.name = galleryName;
            $scope.images = $scope.galleries[$scope.name].images;

            $scope.selectedImage = {
                image: null
            };

            var modalInstance = $uibModal.open({
                template: '<gallery name="{{ name }}" images="images" selected-image="selectedImage" close-modal="closeModal()"></gallery>',
                controller: 'GalleryController',
                windowClass: 'modal-window',
                scope: $scope
            });

        };

        $scope.membersColors = ['blue', 'red', 'green'];
        $scope.gigsColors = ['blue', 'red', 'green'];

        $scope.getColorClass = function(index, colorsArray) {
            return colorsArray[index % colorsArray.length];
        };

    });

});
