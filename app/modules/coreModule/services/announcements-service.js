define(function() {

    let app = angular.module('coreModule');

    app.factory('AnnouncementsService', ['$http', '$rootScope', function($http, $rootScope) {

        let announcementsService = {

            getAnnouncements: function() {

                return new Promise((resolve) => {
                    resolve([{date: new Date(), content: 'Hej allihopa!'}, {date: new Date(), content: 'Hejdå allihopa!'}]);
                });

            }
        };
        return announcementsService;

    }]);
});