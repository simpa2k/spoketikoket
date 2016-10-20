define(function() {

    var app = angular.module('coreModule');

    app.service('fileUpload', ['$http', function($http) {

        var self = this;

        self.uploadFileToUrl = function(files, uploadUrl) {

            var formData = new FormData();

            angular.forEach(files, function (value) {
                formData.append('files[]', value);
            });

            $http.post(uploadUrl, formData, {

                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}

            }).success(function() {
                return true;
            }).error(function() {
                return false;
            });
        };

    }]);

});
