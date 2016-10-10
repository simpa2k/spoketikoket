define(function() {

    var app = angular.module('coreModule');

    app.controller('AdminController', function($scope) {

        $scope.headings = [
            {
                'KONSERTER': 'admin.gigs',
                'BESKRIVNING': 'admin.description',
                'MEDLEMMAR': 'admin.members'
            },
            {
                'BILDER': 'admin.galleries',
                'VIDEO/LJUD': 'admin.embeddeditems',
                'KONTAKT': 'admin.contact'
            }
        ]

    });
});
