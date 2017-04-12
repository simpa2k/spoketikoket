define(function() {

    let adminPage =  function() {

        let controller = ['$scope', function($scope) {

            $scope.objectToSend = {};

            $scope.action = "Lägg till";
            $scope.addingNew = true;

            $scope.send = function(formName) {
                console.log($scope.objectToSend);
            }

        }];

        return {

            restrict: 'E',
            replace: true,
            scope: {
                items: '=',
                formStructure: '=',
                formName: '@',
                entityName: '@'
            },
            templateUrl: 'app/modules/coreModule/directives/admin-page/admin-page.html',
            controller: controller
        }
    };

    angular.module('coreModule')
        .directive('adminPage', adminPage);
});