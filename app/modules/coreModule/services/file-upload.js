define(function() {

    var app = angular.module('coreModule');

    app.service('fileUpload', ['$http', function($http) {

        let self = this;
        let requestObject = { 
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        };

        var createFormData = function(files) {

            let formData = new FormData();

            angular.forEach(files, function (value) {
                formData.append('files[]', value);
            });

            return formData;

        };

        self.postFileToUrl = function(files, uploadUrl) {

            let formData = createFormData(files);
            return $http.post(uploadUrl, formData, requestObject);
        };

        self.putFileToUrl = function(files, uploadUrl) {

            let formData = createFormData(files);
            return $http.put(uploadUrl, formData, requestObject);
            
        };

    }]);

});
