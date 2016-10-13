define(function() {

    var app = angular.module('coreModule');

    app.service('fileUpload', ['$http', function($http) {

        var self = this;

        self.uploadFileToUrl = function(files, uploadUrl) {

            var formData = new FormData();

            console.log(files);
            angular.forEach(files, function (value) {
                formData.append('file', value);
            });

            $http.post(uploadUrl, formData, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function() {

            }).error(function() {

            });
        };

    }]);

});