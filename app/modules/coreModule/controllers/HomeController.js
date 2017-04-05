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
                imageText: "images/socialmedia/facebooktext.png"
            },
            {
                linkHref: "https://open.spotify.com/artist/3mGBGDMzA9TYvtj8aFnQxL",
                imageSource: "images/socialmedia/spotify_29.png",
                imageText: ""
            },
            {
                linkHref: "https://www.youtube.com/channel/UCBnvUMnm1tU1O2ioTnUNJNw",
                imageSource: "images/socialmedia/yt29.png",
                imageText: "images/socialmedia/youtubetext.png"
            }
        ];

        $scope.dateFilter = function() {
            return function(gig) {
                return DateService.compareYearMonthDay(gig.datetime, $scope.currentDate);
            }
        };

    });

});