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
                return $scope.filterFunction(gig.datetime, $scope.currentDate);
            }
        };

        const showEarlierGigs = function() {

            $scope.gigsHeading = 'SPELADE KONSERTER';
            $scope.toggleGigsButtonText = 'Se var vi ska spela framöver';

            $scope.filterFunction = DateService.earlierThan;

            $scope.showSelectedGigs = showUpcomingGigs;

        };

        const showUpcomingGigs = function() {

            $scope.gigsHeading = 'KOMMANDE KONSERTER';
            $scope.toggleGigsButtonText = 'Se var vi har spelat tidigare';

            $scope.filterFunction = DateService.laterThan;

            $scope.showSelectedGigs = showEarlierGigs;

        };

        $scope.showSelectedGigs = showUpcomingGigs;
        $scope.showSelectedGigs();

    });
});