define(function() {

    let adminPage =  function() {

        let controller = ['$scope', function($scope) {

            $scope.objectToSend = {};

            $scope.setPutState = function(item) {

                $scope.objectToSend = angular.copy(item);

                $scope.addingNew = false;
                $scope.action = "Bekräfta ändringar";

                $scope.send = $scope.put;

            };

            $scope.setPostState = function() {

                $scope.objectToSend = {};

                $scope.action = "Lägg till";
                $scope.addingNew = true;

                $scope.send = $scope.post;

            };

            $scope.put = function(formName) {
                console.log($scope.objectToSend);
            };

            $scope.post = function(formName) {
                console.log($scope.objectToSend);
            };

            $scope.delete = function(formName) {
                console.log($scope.objectToSend);
            };

            $scope.setPostState();

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