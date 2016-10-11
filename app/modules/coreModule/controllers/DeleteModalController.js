define(function() {

    var app = angular.module('coreModule');

    app.controller('DeleteModalController', function($scope, $uibModalInstance) {

        $scope.cancel = function() {

            $uibModalInstance.dismiss();

        };

        $scope.confirm = function() {

            $uibModalInstance.close();

        };

    });


});