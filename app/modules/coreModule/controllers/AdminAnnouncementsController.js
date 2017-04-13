define(function() {

    let app = angular.module('coreModule');

    app.controller('AdminAnnouncementsController', function($scope) {

        $scope.items = $scope.gigs;
        $scope.formName = 'announcementsForm';
        $scope.entityName = 'announcements';

        $scope.formStructure = [

            {
                label: 'Välj datum och tid:',
                fields: {
                    datetime: 'datetime'
                }
            },
            {
                label: 'Annan nyttig information:',
                fields: {
                    ticketlink: 'text',
                    info: 'text',
                    price: 'text'
                }
            },
            {
                label: 'Välj spelställe:',
                fields: {
                    venue_name: 'text',
                    address: 'text',
                    city: 'text',
                    webpage: 'text'
                }
            },
            {
                label: 'Test',
                fields: {
                    textarea: 'textarea'
                }
            }
        ]
    });
});