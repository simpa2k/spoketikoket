define(function() {

    var app = angular.module('coreModule');

    app.controller('HomeController', function($scope) {

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

    });

});