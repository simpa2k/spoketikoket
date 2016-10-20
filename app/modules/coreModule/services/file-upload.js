define(function() {

    var app = angular.module('coreModule');

    app.service('fileUpload', ['$http', function($http) {

         let self = this;

        self.uploadFileToUrl = function(files, uploadUrl) {

            let formData = new FormData();

            angular.forEach(files, function (value) {
                formData.append('files[]', value);
            });

            return $http.post(uploadUrl, formData, {

                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}

            });
        };

    }]);

});
