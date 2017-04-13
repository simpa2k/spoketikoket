define(function() {

    let app = angular.module('coreModule');

    app.controller('AdminAnnouncementsController', function($scope) {

        $scope.formName = 'announcementsForm';
        $scope.entityName = 'announcements';
        $scope.refreshCallback = function(announcements) {
            $scope.announcements = announcements;
        };

        $scope.createAnnouncement = function() {
            return {date: new Date()};
        };

        $scope.formStructure = [

            {
                label: 'Beskrivning:',
                fields: {
                    content: 'textarea'
                }
            }
        ];
    });
});