define(function() {

    let app = angular.module('coreModule');

    app.controller('AdminAnnouncementsController', function($scope) {

        $scope.formName = 'announcementsForm';
        $scope.entityName = 'announcement';
        $scope.model = {
            address: {},
            city: {},
            date: {},
            time: {
                element: 'div',
                additionalAttributes: {
                    uibTimepicker: "",
                    showMeridian: false
                }
            },
            info: {},
            price: {},
            ticketlink: {},
            venue_name: {},
            webpage: {}
        }
    });
});