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

                element.bind('change', function() {

                    let urls = [];

                    var readAndPushFileUrl = function(event) {

                        let url = event.target.result;
                        urls.push(url);

                        scope.$apply(function() {
                            modelSetter(scope, urls);
                        });

                    };

                    angular.forEach(element[0].files, function (value) {

                        let reader = new FileReader();
                        reader.onload = function(event) {
                            readAndPushFileUrl(event);
                        };

                        reader.readAsDataURL(value);

                    });

                });
            }
        };

    }]);

});