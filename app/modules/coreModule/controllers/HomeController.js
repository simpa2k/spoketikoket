define(function() {

    var app = angular.module('coreModule');

    app.controller('HomeController', function($scope, DateService) {

        $scope.headings = [
            {
                "KONSERTER": "#gigs-section",
                "OM SPÖKET": "#description-section",
                "MEDLEMMAR": "#members-section"
            },
            {
                "MEDIA": "#media-section",
                "KONTAKT": "#contact-section"
            }

        ];

        $scope.socialmedia = [
            {
                linkHref: "http://www.facebook.com/spoketikoket",
                imageSource: "images/socialmedia/facebooklogga_29.png",
                //imageText: "images/socialmedia/facebooktext.png"
                imageText: "" // This is to make things look consistent, since there is no text for the spotify button yet.
            },
            {
                linkHref: "https://open.spotify.com/artist/3mGBGDMzA9TYvtj8aFnQxL",
                imageSource: "images/socialmedia/spotify_29.png",
                imageText: ""
            },
            {
                linkHref: "https://www.youtube.com/channel/UCBnvUMnm1tU1O2ioTnUNJNw",
                imageSource: "images/socialmedia/yt29.png",
                //imageText: "images/socialmedia/youtubetext.png"
                imageText: ""
            }
        ];

        $scope.dateFilter = function() {
            return function(gig) {
                return DateService.laterThan(gig.datetime, $scope.currentDate);
            }
        };

        $scope.earlierGigsDateFilter = function() {
            return function(gig) {
                return DateService.earlierThan(gig.datetime, $scope.currentDate);
            }
        };

        $scope.showEarlierGigs = function() {

        }
    });

});