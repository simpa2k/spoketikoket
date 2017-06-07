define(function() {

    let earlierGigs = function() {

        return {

            restrict: 'E',
            replace: true,
            scope: {
                gigs: '=',
                earlierGigsFilter: '&',
                getColorClass: '&'
            },
            templateUrl: 'app/modules/coreModule/directives/earlier-gigs/earlier-gigs.html',
            link: function(scope, element, attributes) {

            }
        }
    };

    angular.module('coreModule')
        .directive('earlierGigs', earlierGigs);
});