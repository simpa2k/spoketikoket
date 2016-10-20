define(function() {


    /*
     * This code is the result of merging an example from https://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
     * and one from https://scotch.io/tutorials/use-the-html5-file-api-to-work-with-files-locally-in-the-browser
     */

    var app = angular.module('coreModule');

    app.directive('fileModel', ['$parse', function($parse) {

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                let model = $parse(attrs.fileModel);
                let modelSetter = model.assign;
                let filesWithUrls = [];

                element.bind('change', function() {

                    var readAndPushFileAndUrl = function(event, file) {

                        let fileWithUrl = {
                                url: event.target.result,
                                file: file 
                        }	

                        filesWithUrls.push(fileWithUrl);

                        scope.$apply(function() {
                            modelSetter(scope, filesWithUrls);
                        });

                    };

                    angular.forEach(element[0].files, function(value) {

                        let reader = new FileReader();
                        reader.onload = function(event) {
                            readAndPushFileAndUrl(event, value);
                        };

                        reader.readAsDataURL(value);

                    });

                });
            }
        };

    }]);

});
